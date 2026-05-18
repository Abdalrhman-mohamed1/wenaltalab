import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackingGateway } from '../tracking/tracking.gateway';
import { DeliveryStatus } from '@prisma/client';

@Injectable()
export class DriverService {
  constructor(
    private prisma: PrismaService,
    private trackingGateway: TrackingGateway,
  ) {}

  async getOrCreateDriverProfile(userId: string) {
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

  async getDashboardData(userId: string) {
    const driver = await this.getOrCreateDriverProfile(userId);

    const availableOrdersCount = await this.prisma.order.count({
      where: {
        driverId: null,
        status: { in: [DeliveryStatus.REQUESTED, DeliveryStatus.PENDING] },
      },
    });

    const activeOrdersCount = await this.prisma.order.count({
      where: {
        driverId: driver.id,
        status: {
          in: [
            DeliveryStatus.ASSIGNED,
            DeliveryStatus.ACCEPTED,
            DeliveryStatus.PICKED_UP,
            DeliveryStatus.IN_TRANSIT,
            DeliveryStatus.ON_THE_WAY,
            DeliveryStatus.DRIVER_EN_ROUTE,
            DeliveryStatus.NEAR_DESTINATION,
          ],
        },
      },
    });

    const completedOrdersCount = await this.prisma.order.count({
      where: {
        driverId: driver.id,
        status: DeliveryStatus.DELIVERED,
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
        status: { in: [DeliveryStatus.REQUESTED, DeliveryStatus.PENDING] },
      },
      include: {
        customer: { select: { firstName: true, lastName: true, phone: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getActiveOrders(userId: string) {
    const driver = await this.getOrCreateDriverProfile(userId);

    return this.prisma.order.findMany({
      where: {
        driverId: driver.id,
        status: {
          in: [
            DeliveryStatus.ASSIGNED,
            DeliveryStatus.ACCEPTED,
            DeliveryStatus.PICKED_UP,
            DeliveryStatus.IN_TRANSIT,
            DeliveryStatus.ON_THE_WAY,
            DeliveryStatus.DRIVER_EN_ROUTE,
            DeliveryStatus.NEAR_DESTINATION,
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

  async getCompletedOrders(userId: string) {
    const driver = await this.getOrCreateDriverProfile(userId);

    return this.prisma.order.findMany({
      where: {
        driverId: driver.id,
        status: DeliveryStatus.DELIVERED,
      },
      include: {
        customer: { select: { firstName: true, lastName: true, phone: true, companyName: true } },
        items: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async acceptOrder(userId: string, orderId: string) {
    const driver = await this.getOrCreateDriverProfile(userId);

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.driverId) throw new BadRequestException('Order already accepted by another driver');

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        driverId: driver.id,
        status: DeliveryStatus.ACCEPTED,
      },
      include: { customer: true, items: true },
    });

    // Notify via websocket
    if (this.trackingGateway.server) {
      this.trackingGateway.server.to(`order_${orderId}`).emit('status_updated', {
        orderId,
        status: DeliveryStatus.ACCEPTED,
        driverName: `${driver.user?.firstName} ${driver.user?.lastName}`,
        driverPhone: driver.user?.phone,
      });
    }

    return updatedOrder;
  }

  async rejectOrder(userId: string, orderId: string) {
    // For now, rejection simply logs and doesn't assign
    return { success: true, message: 'Order rejected' };
  }

  async updateOrderStatus(userId: string, orderId: string, status: DeliveryStatus) {
    const driver = await this.getOrCreateDriverProfile(userId);

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.driverId !== driver.id) throw new BadRequestException('Not assigned to this order');

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { customer: true, items: true },
    });

    // If delivered, credit earnings to driver (e.g. 80% of total fare or full fare)
    if (status === DeliveryStatus.DELIVERED) {
      await this.prisma.driver.update({
        where: { id: driver.id },
        data: {
          earnings: { increment: order.totalFare || 0 },
        },
      });
    }

    // Notify via websocket
    if (this.trackingGateway.server) {
      this.trackingGateway.server.to(`order_${orderId}`).emit('status_updated', {
        orderId,
        status,
      });
    }

    return updatedOrder;
  }

  async getEarningsSummary(userId: string) {
    const driver = await this.getOrCreateDriverProfile(userId);

    const completedOrders = await this.prisma.order.findMany({
      where: {
        driverId: driver.id,
        status: DeliveryStatus.DELIVERED,
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
}
