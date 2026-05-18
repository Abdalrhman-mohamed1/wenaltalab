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
exports.DriverService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tracking_gateway_1 = require("../tracking/tracking.gateway");
const client_1 = require("@prisma/client");
let DriverService = class DriverService {
    prisma;
    trackingGateway;
    constructor(prisma, trackingGateway) {
        this.prisma = prisma;
        this.trackingGateway = trackingGateway;
    }
    async getOrCreateDriverProfile(userId) {
        let driver = await this.prisma.driver.findUnique({
            where: { userId },
            include: { user: true, vehicle: true },
        });
        if (!driver) {
            driver = await this.prisma.driver.create({
                data: {
                    userId,
                    isOnline: true,
                    earnings: 0.0,
                },
                include: { user: true, vehicle: true },
            });
        }
        return driver;
    }
    async getDashboardData(userId) {
        const driver = await this.getOrCreateDriverProfile(userId);
        const availableOrdersCount = await this.prisma.order.count({
            where: {
                driverId: null,
                status: { in: [client_1.DeliveryStatus.REQUESTED, client_1.DeliveryStatus.PENDING] },
            },
        });
        const activeOrdersCount = await this.prisma.order.count({
            where: {
                driverId: driver.id,
                status: {
                    in: [
                        client_1.DeliveryStatus.ASSIGNED,
                        client_1.DeliveryStatus.ACCEPTED,
                        client_1.DeliveryStatus.PICKED_UP,
                        client_1.DeliveryStatus.IN_TRANSIT,
                        client_1.DeliveryStatus.ON_THE_WAY,
                        client_1.DeliveryStatus.DRIVER_EN_ROUTE,
                        client_1.DeliveryStatus.NEAR_DESTINATION,
                    ],
                },
            },
        });
        const completedOrdersCount = await this.prisma.order.count({
            where: {
                driverId: driver.id,
                status: client_1.DeliveryStatus.DELIVERED,
            },
        });
        return {
            driverProfile: driver,
            earnings: driver.earnings,
            availableOrdersCount,
            activeOrdersCount,
            completedOrdersCount,
        };
    }
    async getAvailableOrders() {
        return this.prisma.order.findMany({
            where: {
                driverId: null,
                status: { in: [client_1.DeliveryStatus.REQUESTED, client_1.DeliveryStatus.PENDING] },
            },
            include: {
                customer: { select: { firstName: true, lastName: true, phone: true } },
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getActiveOrders(userId) {
        const driver = await this.getOrCreateDriverProfile(userId);
        return this.prisma.order.findMany({
            where: {
                driverId: driver.id,
                status: {
                    in: [
                        client_1.DeliveryStatus.ASSIGNED,
                        client_1.DeliveryStatus.ACCEPTED,
                        client_1.DeliveryStatus.PICKED_UP,
                        client_1.DeliveryStatus.IN_TRANSIT,
                        client_1.DeliveryStatus.ON_THE_WAY,
                        client_1.DeliveryStatus.DRIVER_EN_ROUTE,
                        client_1.DeliveryStatus.NEAR_DESTINATION,
                    ],
                },
            },
            include: {
                customer: { select: { firstName: true, lastName: true, phone: true, companyName: true } },
                items: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getCompletedOrders(userId) {
        const driver = await this.getOrCreateDriverProfile(userId);
        return this.prisma.order.findMany({
            where: {
                driverId: driver.id,
                status: client_1.DeliveryStatus.DELIVERED,
            },
            include: {
                customer: { select: { firstName: true, lastName: true, phone: true, companyName: true } },
                items: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async acceptOrder(userId, orderId) {
        const driver = await this.getOrCreateDriverProfile(userId);
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.driverId)
            throw new common_1.BadRequestException('Order already accepted by another driver');
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: {
                driverId: driver.id,
                status: client_1.DeliveryStatus.ACCEPTED,
            },
            include: { customer: true, items: true },
        });
        if (this.trackingGateway.server) {
            this.trackingGateway.server.to(`order_${orderId}`).emit('status_updated', {
                orderId,
                status: client_1.DeliveryStatus.ACCEPTED,
                driverName: `${driver.user?.firstName} ${driver.user?.lastName}`,
                driverPhone: driver.user?.phone,
            });
        }
        return updatedOrder;
    }
    async rejectOrder(userId, orderId) {
        return { success: true, message: 'Order rejected' };
    }
    async updateOrderStatus(userId, orderId, status) {
        const driver = await this.getOrCreateDriverProfile(userId);
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.driverId !== driver.id)
            throw new common_1.BadRequestException('Not assigned to this order');
        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: { customer: true, items: true },
        });
        if (status === client_1.DeliveryStatus.DELIVERED) {
            await this.prisma.driver.update({
                where: { id: driver.id },
                data: {
                    earnings: { increment: order.totalFare || 0 },
                },
            });
        }
        if (this.trackingGateway.server) {
            this.trackingGateway.server.to(`order_${orderId}`).emit('status_updated', {
                orderId,
                status,
            });
        }
        return updatedOrder;
    }
    async getEarningsSummary(userId) {
        const driver = await this.getOrCreateDriverProfile(userId);
        const completedOrders = await this.prisma.order.findMany({
            where: {
                driverId: driver.id,
                status: client_1.DeliveryStatus.DELIVERED,
            },
            select: {
                id: true,
                totalFare: true,
                updatedAt: true,
                pickupAddress: true,
                dropoffAddress: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
        const totalDelivered = completedOrders.length;
        const totalEarnings = completedOrders.reduce((sum, ord) => sum + (ord.totalFare || 0), 0);
        return {
            driverId: driver.id,
            earnings: driver.earnings,
            totalDelivered,
            totalCalculatedEarnings: totalEarnings,
            history: completedOrders,
        };
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tracking_gateway_1.TrackingGateway])
], DriverService);
//# sourceMappingURL=driver.service.js.map