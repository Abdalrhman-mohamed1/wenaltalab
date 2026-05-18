import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { DeliveryStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  // Simple Haversine distance mock for fare calc
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }

  async create(customerId: string, createOrderDto: CreateOrderDto) {
    const { pickupLat, pickupLng, dropoffLat, dropoffLng, itemDescription, itemCategory, ...orderData } = createOrderDto;
    
    // 1. Calculate fare and distance
    const distanceKm = this.calculateDistance(pickupLat, pickupLng, dropoffLat, dropoffLng);
    const estimatedTimeMin = Math.ceil(distanceKm * 3); // Mock 3 mins per km
    const baseFare = 20;
    const totalFare = baseFare + (distanceKm * 5); // Mock 5 EGP per km

    // 2. Create Order in DB
    const order = await this.prisma.order.create({
      data: {
        ...orderData,
        customerId,
        pickupLat,
        pickupLng,
        dropoffLat,
        dropoffLng,
        distanceKm,
        estimatedTimeMin,
        totalFare,
        status: DeliveryStatus.REQUESTED,
        paymentStatus: PaymentStatus.PENDING,
        items: {
          create: {
            description: itemDescription,
            category: itemCategory,
          }
        }
      },
      include: {
        items: true,
      }
    });

    return order;
  }

  async findAll(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      include: { items: true, driver: { include: { user: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { 
        items: true, 
        driver: { include: { user: true, vehicle: true } }, 
        tracking: { orderBy: { timestamp: 'desc' } },
        customer: { select: { id: true, firstName: true, lastName: true, phone: true } }
      }
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: DeliveryStatus, driverId?: string) {
    return this.prisma.order.update({
      where: { id },
      data: { 
        status,
        ...(driverId && { driverId }) 
      }
    });
  }
}
