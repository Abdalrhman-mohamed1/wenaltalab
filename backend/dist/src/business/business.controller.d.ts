import { BusinessService } from './business.service';
export declare class BusinessController {
    private readonly businessService;
    constructor(businessService: BusinessService);
    getDashboard(req: any): Promise<{
        totalOrders: number;
        pendingOrders: number;
        inTransitOrders: number;
        deliveredOrders: number;
        totalSpent: number;
    }>;
    createBulkOrders(req: any, orders: any[]): Promise<{
        success: boolean;
        count: number;
        orders: any[];
    }>;
    getAnalytics(req: any): Promise<{
        totalCount: number;
        statusBreakdown: {
            pending: number;
            in_progress: number;
            delivered: number;
            canceled: number;
        };
        packageTypes: Record<string, number>;
        dailyTrend: any[];
    }>;
    updateProfile(req: any, updateData: any): Promise<{
        id: string;
        phone: string;
        email: string | null;
        firstName: string;
        lastName: string;
        role: import("@prisma/client").$Enums.Role;
        companyName: string | null;
    }>;
    getAllDeliveries(req: any): Promise<({
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
}
