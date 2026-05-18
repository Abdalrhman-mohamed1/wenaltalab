import { PaymentMethod } from '@prisma/client';
export declare class CreateOrderDto {
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    dropoffAddress: string;
    dropoffLat: number;
    dropoffLng: number;
    paymentMethod: PaymentMethod;
    itemDescription: string;
    itemCategory: string;
    couponCode?: string;
    receiverName?: string;
    receiverPhone?: string;
    packageType?: string;
    notes?: string;
}
