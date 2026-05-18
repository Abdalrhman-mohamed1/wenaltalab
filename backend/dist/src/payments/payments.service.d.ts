import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentsService {
    private prisma;
    private readonly paymobUrl;
    private readonly apiKey;
    private readonly integrationId;
    constructor(prisma: PrismaService);
    createPaymentSession(orderId: string, amount: number): Promise<{
        paymentUrl: string;
        token: any;
    }>;
    verifyWebhook(data: any): Promise<boolean>;
}
