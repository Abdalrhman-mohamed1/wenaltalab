import { PrismaService } from '../prisma/prisma.service';
import { TrackingGateway } from '../tracking/tracking.gateway';
import { DeliveryStatus } from '@prisma/client';
export declare class DriverService {
    private prisma;
    private trackingGateway;
    constructor(prisma: PrismaService, trackingGateway: TrackingGateway);
    getOrCreateDriverProfile(userId: string): Promise<{
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
    }>;
    getDashboardData(userId: string): Promise<{
        driverProfile: {
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
        };
        earnings: number;
        availableOrdersCount: number;
        activeOrdersCount: number;
        completedOrdersCount: number;
    }>;
    getAvailableOrders(): Promise<({
        customer: {
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
    })[]>;
    getActiveOrders(userId: string): Promise<({
        customer: {
            phone: string;
            firstName: string;
            lastName: string;
            companyName: string | null;
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
    })[]>;
    getCompletedOrders(userId: string): Promise<({
        customer: {
            phone: string;
            firstName: string;
            lastName: string;
            companyName: string | null;
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
    })[]>;
    acceptOrder(userId: string, orderId: string): Promise<{
        customer: {
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
    rejectOrder(userId: string, orderId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateOrderStatus(userId: string, orderId: string, status: DeliveryStatus): Promise<{
        customer: {
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
    getEarningsSummary(userId: string): Promise<{
        driverId: string;
        earnings: number;
        totalDelivered: number;
        totalCalculatedEarnings: number;
        history: {
            id: string;
            updatedAt: Date;
            pickupAddress: string;
            dropoffAddress: string;
            totalFare: number;
        }[];
    }>;
}
