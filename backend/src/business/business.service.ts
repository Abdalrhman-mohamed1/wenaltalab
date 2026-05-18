import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryStatus, PaymentStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a =
      0.5 -
      c((lat2 - lat1) * p) / 2 +
      (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
    return 12742 * Math.asin(Math.sqrt(a));
  }

  async getDashboardData(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        OR: [{ customerId: userId }, { businessId: userId }],
      },
    });

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) =>
      [DeliveryStatus.REQUESTED, DeliveryStatus.PENDING].includes(o.status as any),
    ).length;
    const inTransitOrders = orders.filter((o) =>
      [
        DeliveryStatus.ASSIGNED,
        DeliveryStatus.ACCEPTED,
        DeliveryStatus.PICKED_UP,
        DeliveryStatus.IN_TRANSIT,
        DeliveryStatus.ON_THE_WAY,
        DeliveryStatus.DRIVER_EN_ROUTE,
      ].includes(o.status as any),
    ).length;
    const deliveredOrders = orders.filter((o) => o.status === DeliveryStatus.DELIVERED).length;
    const totalSpent = orders.reduce((sum, o) => sum + (o.totalFare || 0), 0);

    return {
      totalOrders,
      pendingOrders,
      inTransitOrders,
      deliveredOrders,
      totalSpent,
    };
  }

  async createBulkOrders(userId: string, ordersData: any[]) {
    const createdOrders: any[] = [];

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
        totalFare += 25; // Express priority surcharge
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
          status: DeliveryStatus.REQUESTED,
          paymentMethod: PaymentMethod.CASH,
          paymentStatus: PaymentStatus.PENDING,
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

  async getAnalytics(userId: string) {
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
      pending: orders.filter((o) =>
        [DeliveryStatus.REQUESTED, DeliveryStatus.PENDING].includes(o.status as any),
      ).length,
      in_progress: orders.filter((o) =>
        [
          DeliveryStatus.ASSIGNED,
          DeliveryStatus.ACCEPTED,
          DeliveryStatus.PICKED_UP,
          DeliveryStatus.IN_TRANSIT,
          DeliveryStatus.ON_THE_WAY,
        ].includes(o.status as any),
      ).length,
      delivered: orders.filter((o) => o.status === DeliveryStatus.DELIVERED).length,
      canceled: orders.filter((o) => o.status === DeliveryStatus.CANCELED).length,
    };

    const packageTypes: Record<string, number> = {};
    orders.forEach((o) => {
      const t = o.packageType || 'Parcel';
      packageTypes[t] = (packageTypes[t] || 0) + 1;
    });

    // Last 7 days chart data
    const last7Days: any[] = [];
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

  async updateProfile(userId: string, updateData: any) {
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

  async getAllDeliveries(userId: string) {
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
}
