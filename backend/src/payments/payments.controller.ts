import { Controller, Post, Body, Req, UseGuards, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':orderId/pay')
  createPayment(@Param('orderId') orderId: string, @Body('amount') amount: number) {
    return this.paymentsService.createPaymentSession(orderId, amount);
  }

  // Webhook for Paymob
  @Post('webhook')
  handleWebhook(@Body() data: any) {
    return this.paymentsService.verifyWebhook(data);
  }
}
