import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPayment(orderId: string, amount: number): Promise<{
        paymentUrl: string;
        token: any;
    }>;
    handleWebhook(data: any): Promise<boolean>;
}
