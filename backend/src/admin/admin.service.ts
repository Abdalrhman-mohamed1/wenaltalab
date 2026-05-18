import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalUsers = await this.prisma.user.count({ where: { role: Role.CUSTOMER } });
    const totalDrivers = await this.prisma.user.count({ where: { role: Role.DRIVER } });
    const totalBusinesses = await this.prisma.user.count({ where: { role: Role.BUSINESS } });
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
      where: { role: Role.DRIVER },
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

  async verifyDriver(driverId: string) {
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

  async toggleUserActive(userId: string, isActive: boolean) {
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
      where: { role: Role.BUSINESS },
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
}
