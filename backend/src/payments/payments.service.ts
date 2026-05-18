import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  private readonly paymobUrl = 'https://accept.paymob.com/api';
  private readonly apiKey = process.env.PAYMOB_API_KEY;
  private readonly integrationId = process.env.PAYMOB_INTEGRATION_ID;

  constructor(private prisma: PrismaService) {}

  async createPaymentSession(orderId: string, amount: number) {
    try {
      // If no API key provided, mock the successful payment response
      if (!this.apiKey || this.apiKey === '') {
        return { paymentUrl: `https://mock.paymob.com/pay/${orderId}`, token: 'mock-token' };
      }

      // Step 1: Authentication
      const authRes = await axios.post(`${this.paymobUrl}/auth/tokens`, {
        api_key: this.apiKey
      });
      const token = authRes.data.token;

      // Step 2: Order Registration
      const orderRes = await axios.post(`${this.paymobUrl}/ecommerce/orders`, {
        auth_token: token,
        delivery_needed: "false",
        amount_cents: amount * 100, // EGP to cents
        currency: "EGP",
        merchant_order_id: `WAT-${orderId}-${Date.now()}`,
      });
      const paymobOrderId = orderRes.data.id;

      // Step 3: Payment Key Generation
      const paymentKeyRes = await axios.post(`${this.paymobUrl}/acceptance/payment_keys`, {
        auth_token: token,
        amount_cents: amount * 100,
        expiration: 3600,
        order_id: paymobOrderId,
        billing_data: {
          apartment: "NA", email: "customer@winaltalab.com", floor: "NA", first_name: "Customer",
          street: "NA", building: "NA", phone_number: "01000000000", shipping_method: "PKG",
          postal_code: "NA", city: "Cairo", country: "EG", last_name: "WAT", state: "NA"
        },
        currency: "EGP",
        integration_id: this.integrationId
      });

      return { 
        paymentUrl: `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKeyRes.data.token}`,
        token: paymentKeyRes.data.token
      };

    } catch (error) {
      console.error('Paymob error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to generate payment session');
    }
  }

  async verifyWebhook(data: any) {
    // Basic verification of Paymob webhook success
    if (data.obj.success) {
      // Find order by merchant_order_id and update status to PAID
      console.log('Payment successful for:', data.obj.order.merchant_order_id);
      return true;
    }
    return false;
  }
}
