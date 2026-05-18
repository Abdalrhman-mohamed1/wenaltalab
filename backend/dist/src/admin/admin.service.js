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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const totalUsers = await this.prisma.user.count({ where: { role: client_1.Role.CUSTOMER } });
        const totalDrivers = await this.prisma.user.count({ where: { role: client_1.Role.DRIVER } });
        const totalBusinesses = await this.prisma.user.count({ where: { role: client_1.Role.BUSINESS } });
        const totalOrders = await this.prisma.order.count();
        const completedOrders = await this.prisma.order.findMany({
            where: { status: 'DELIVERED' },
            select: { totalFare: true },
        });
        const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.totalFare || 0), 0);
        return { totalUsers, totalDrivers, totalBusinesses, totalOrders, totalRevenue };
    }
    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
                companyName: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAllDrivers() {
        return this.prisma.user.findMany({
            where: { role: client_1.Role.DRIVER },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
                isActive: true,
                createdAt: true,
                driverProfile: {
                    include: { vehicle: true, documents: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async verifyDriver(driverId) {
        const user = await this.prisma.user.update({
            where: { id: driverId },
            data: { isActive: true },
            include: { driverProfile: true },
        });
        if (user.driverProfile) {
            await this.prisma.driver.update({
                where: { id: user.driverProfile.id },
                data: { kycStatus: 'APPROVED' },
            });
        }
        return { success: true, user };
    }
    async toggleUserActive(userId, isActive) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { isActive },
            select: { id: true, isActive: true },
        });
    }
    async getAllOrders() {
        return this.prisma.order.findMany({
            include: {
                customer: { select: { id: true, firstName: true, lastName: true, phone: true } },
                driver: { include: { user: { select: { firstName: true, lastName: true, phone: true } } } },
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAllBusinesses() {
        return this.prisma.user.findMany({
            where: { role: client_1.Role.BUSINESS },
            select: {
                id: true,
                companyName: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
                isActive: true,
                createdAt: true,
                businessOrders: {
                    select: {
                        id: true,
                        status: true,
                        totalFare: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map