"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let BusinessService = class BusinessService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const p = 0.017453292519943295;
        const c = Math.cos;
        const a = 0.5 -
            c((lat2 - lat1) * p) / 2 +
            (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
        return 12742 * Math.asin(Math.sqrt(a));
    }
    async getDashboardData(userId) {
        const orders = await this.prisma.order.findMany({
            where: {
                OR: [{ customerId: userId }, { businessId: userId }],
            },
        });
        const totalOrders = orders.length;
        const pendingOrders = orders.filter((o) => [client_1.DeliveryStatus.REQUESTED, client_1.DeliveryStatus.PENDING].includes(o.status)).length;
        const inTransitOrders = orders.filter((o) => [
            client_1.DeliveryStatus.ASSIGNED,
            client_1.DeliveryStatus.ACCEPTED,
            client_1.DeliveryStatus.PICKED_UP,
            client_1.DeliveryStatus.IN_TRANSIT,
            client_1.DeliveryStatus.ON_THE_WAY,
            client_1.DeliveryStatus.DRIVER_EN_ROUTE,
        ].includes(o.status)).length;
        const deliveredOrders = orders.filter((o) => o.status === client_1.DeliveryStatus.DELIVERED).length;
        const totalSpent = orders.reduce((sum, o) => sum + (o.totalFare || 0), 0);
        return {
            totalOrders,
            pendingOrders,
            inTransitOrders,
            deliveredOrders,
            totalSpent,
        };
    }
    async createBulkOrders(userId, ordersData) {
        const createdOrders = [];
        for (const item of ordersData) {
            const pickupLat = parseFloat(item.pickupLat) || 30.0444;
            const pickupLng = parseFloat(item.pickupLng) || 31.2357;
            const dropoffLat = parseFloat(item.dropoffLat) || 30.05;
            const dropoffLng = parseFloat(item.dropoffLng) || 31.25;
            const distanceKm = this.calculateDistance(pickupLat, pickupLng, dropoffLat, dropoffLng);
            const estimatedTimeMin = Math.ceil(distanceKm * 3);
            const baseFare = 20;
            let totalFare = baseFare + distanceKm * 5;
            const isExpress = item.priority === "EXPRESS" || item.priority === "عاجل" || item.priority === "express";
            if (isExpress) {
                totalFare += 25;
            }
            const orderNotes = (isExpress ? "[أولوية التوصيل: عاجل] " : "") + (item.notes || "Bulk delivery");
            const order = await this.prisma.order.create({
                data: {
                    customerId: userId,
                    businessId: userId,
                    pickupAddress: item.pickupAddress || 'Business Headquarters',
                    pickupLat,
                    pickupLng,
                    dropoffAddress: item.dropoffAddress || 'Customer Location',
                    dropoffLat,
                    dropoffLng,
                    receiverName: item.receiverName || 'Valued Customer',
                    receiverPhone: item.receiverPhone || '01000000000',
                    packageType: item.packageType || 'Parcel',
                    notes: orderNotes,
                    distanceKm,
                    estimatedTimeMin,
                    totalFare: Math.round(totalFare),
                    status: client_1.DeliveryStatus.REQUESTED,
                    paymentMethod: client_1.PaymentMethod.CASH,
                    paymentStatus: client_1.PaymentStatus.PENDING,
                    items: {
                        create: {
                            description: item.itemDescription || item.packageDetails || item.packageType || 'Bulk item',
                            category: item.itemCategory || 'PARCEL',
                        },
                    },
                },
                include: { items: true },
            });
            createdOrders.push(order);
        }
        return {
            success: true,
            count: createdOrders.length,
            orders: createdOrders,
        };
    }
    async getAnalytics(userId) {
        const orders = await this.prisma.order.findMany({
            where: {
                OR: [{ customerId: userId }, { businessId: userId }],
            },
            select: {
                status: true,
                totalFare: true,
                createdAt: true,
                packageType: true,
            },
        });
        const statusBreakdown = {
            pending: orders.filter((o) => [client_1.DeliveryStatus.REQUESTED, client_1.DeliveryStatus.PENDING].includes(o.status)).length,
            in_progress: orders.filter((o) => [
                client_1.DeliveryStatus.ASSIGNED,
                client_1.DeliveryStatus.ACCEPTED,
                client_1.DeliveryStatus.PICKED_UP,
                client_1.DeliveryStatus.IN_TRANSIT,
                client_1.DeliveryStatus.ON_THE_WAY,
            ].includes(o.status)).length,
            delivered: orders.filter((o) => o.status === client_1.DeliveryStatus.DELIVERED).length,
            canceled: orders.filter((o) => o.status === client_1.DeliveryStatus.CANCELED).length,
        };
        const packageTypes = {};
        orders.forEach((o) => {
            const t = o.packageType || 'Parcel';
            packageTypes[t] = (packageTypes[t] || 0) + 1;
        });
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayOrders = orders.filter((o) => o.createdAt.toISOString().split('T')[0] === dateStr);
            const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.totalFare || 0), 0);
            last7Days.push({
                date: dateStr,
                orders: dayOrders.length,
                spent: Math.round(dayRevenue),
            });
        }
        return {
            totalCount: orders.length,
            statusBreakdown,
            packageTypes,
            dailyTrend: last7Days,
        };
    }
    async updateProfile(userId, updateData) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                companyName: updateData.companyName,
                firstName: updateData.firstName,
                lastName: updateData.lastName,
                phone: updateData.phone,
                email: updateData.email,
            },
            select: {
                id: true,
                companyName: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
                role: true,
            },
        });
    }
    async getAllDeliveries(userId) {
        return this.prisma.order.findMany({
            where: {
                OR: [{ customerId: userId }, { businessId: userId }],
            },
            include: {
                items: true,
                driver: { include: { user: { select: { firstName: true, lastName: true, phone: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.BusinessService = BusinessService;
exports.BusinessService = BusinessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessService);
//# sourceMappingURL=business.service.js.map