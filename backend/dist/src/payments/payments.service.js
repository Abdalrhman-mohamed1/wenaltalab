"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const axios_1 = __importDefault(require("axios"));
let PaymentsService = class PaymentsService {
    prisma;
    paymobUrl = 'https://accept.paymob.com/api';
    apiKey = process.env.PAYMOB_API_KEY;
    integrationId = process.env.PAYMOB_INTEGRATION_ID;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPaymentSession(orderId, amount) {
        try {
            if (!this.apiKey || this.apiKey === '') {
                return { paymentUrl: `https://mock.paymob.com/pay/${orderId}`, token: 'mock-token' };
            }
            const authRes = await axios_1.default.post(`${this.paymobUrl}/auth/tokens`, {
                api_key: this.apiKey
            });
            const token = authRes.data.token;
            const orderRes = await axios_1.default.post(`${this.paymobUrl}/ecommerce/orders`, {
                auth_token: token,
                delivery_needed: "false",
                amount_cents: amount * 100,
                currency: "EGP",
                merchant_order_id: `WAT-${orderId}-${Date.now()}`,
            });
            const paymobOrderId = orderRes.data.id;
            const paymentKeyRes = await axios_1.default.post(`${this.paymobUrl}/acceptance/payment_keys`, {
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
        }
        catch (error) {
            console.error('Paymob error:', error.response?.data || error.message);
            throw new common_1.InternalServerErrorException('Failed to generate payment session');
        }
    }
    async verifyWebhook(data) {
        if (data.obj.success) {
            console.log('Payment successful for:', data.obj.order.merchant_order_id);
            return true;
        }
        return false;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map