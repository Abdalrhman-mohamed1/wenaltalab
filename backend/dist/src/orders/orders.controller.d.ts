import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { DeliveryStatus } from '@prisma/client';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(req: any, createOrderDto: CreateOrderDto): Promise<{
        items: {
            id: string;
            description: string;
            weightKg: number | null;
            dimensions: string | null;
            category: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        pickupAddress: string;
        pickupLat: number;
        pickupLng: number;
        dropoffAddress: string;
        dropoffLat: number;
        dropoffLng: number;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        receiverName: string | null;
        receiverPhone: string | null;
        packageType: string | null;
        notes: string | null;
        status: import("@prisma/client").$Enums.DeliveryStatus;
        distanceKm: number;
        estimatedTimeMin: number;
        totalFare: number;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        customerId: string;
        driverId: string | null;
        businessId: string | null;
        couponId: string | null;
    }>;
    findAll(req: any): Promise<({
        driver: ({
            user: {
                id: string;
                phone: string;
                email: string | null;
                password: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.Role;
                companyName: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            isOnline: boolean;
            currentLat: number | null;
            currentLng: number | null;
            kycStatus: string;
            vehicleId: string | null;
            earnings: number;
        }) | null;
        items: {
            id: string;
            description: string;
            weightKg: number | null;
            dimensions: string | null;
            category: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        pickupAddress: string;
        pickupLat: number;
        pickupLng: number;
        dropoffAddress: string;
        dropoffLat: number;
        dropoffLng: number;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        receiverName: string | null;
        receiverPhone: string | null;
        packageType: string | null;
        notes: string | null;
        status: import("@prisma/client").$Enums.DeliveryStatus;
        distanceKm: number;
        estimatedTimeMin: number;
        totalFare: number;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        customerId: string;
        driverId: string | null;
        businessId: string | null;
        couponId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        driver: ({
            user: {
                id: string;
                phone: string;
                email: string | null;
                password: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.Role;
                companyName: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            vehicle: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                year: number;
                make: string;
                model: string;
                licensePlate: string;
                color: string;
                type: string;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            isOnline: boolean;
            currentLat: number | null;
            currentLng: number | null;
            kycStatus: string;
            vehicleId: string | null;
            earnings: number;
        }) | null;
        tracking: {
            id: string;
            status: import("@prisma/client").$Enums.DeliveryStatus;
            driverId: string | null;
            timestamp: Date;
            lat: number;
            lng: number;
            orderId: string;
        }[];
        customer: {
            id: string;
            phone: string;
            firstName: string;
            lastName: string;
        };
        items: {
            id: string;
            description: string;
            weightKg: number | null;
            dimensions: string | null;
            category: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        pickupAddress: string;
        pickupLat: number;
        pickupLng: number;
        dropoffAddress: string;
        dropoffLat: number;
        dropoffLng: number;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        receiverName: string | null;
        receiverPhone: string | null;
        packageType: string | null;
        notes: string | null;
        status: import("@prisma/client").$Enums.DeliveryStatus;
        distanceKm: number;
        estimatedTimeMin: number;
        totalFare: number;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        customerId: string;
        driverId: string | null;
        businessId: string | null;
        couponId: string | null;
    }>;
    updateStatus(id: string, status: DeliveryStatus): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        pickupAddress: string;
        pickupLat: number;
        pickupLng: number;
        dropoffAddress: string;
        dropoffLat: number;
        dropoffLng: number;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        receiverName: string | null;
        receiverPhone: string | null;
        packageType: string | null;
        notes: string | null;
        status: import("@prisma/client").$Enums.DeliveryStatus;
        distanceKm: number;
        estimatedTimeMin: number;
        totalFare: number;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        customerId: string;
        driverId: string | null;
        businessId: string | null;
        couponId: string | null;
    }>;
}
