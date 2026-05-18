import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        totalUsers: number;
        totalDrivers: number;
        totalBusinesses: number;
        totalOrders: number;
        totalRevenue: number;
    }>;
    getUsers(): Promise<{
        id: string;
        phone: string;
        email: string | null;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        companyName: string | null;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    getDrivers(): Promise<{
        id: string;
        phone: string;
        email: string | null;
        firstName: string;
        lastName: string;
        isActive: boolean;
        createdAt: Date;
        driverProfile: ({
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
            documents: {
                id: string;
                status: string;
                driverId: string;
                type: string;
                url: string;
                uploadedAt: Date;
            }[];
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
    }[]>;
    verifyDriver(id: string): Promise<{
        success: boolean;
        user: {
            driverProfile: {
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
            } | null;
        } & {
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
    }>;
    toggleUserActive(id: string, isActive: boolean): Promise<{
        id: string;
        isActive: boolean;
    }>;
    getOrders(): Promise<({
        driver: ({
            user: {
                phone: string;
                firstName: string;
                lastName: string;
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
    })[]>;
    getBusinesses(): Promise<{
        id: string;
        phone: string;
        email: string | null;
        firstName: string;
        lastName: string;
        companyName: string | null;
        isActive: boolean;
        createdAt: Date;
        businessOrders: {
            id: string;
            status: import("@prisma/client").$Enums.DeliveryStatus;
            totalFare: number;
        }[];
    }[]>;
}
