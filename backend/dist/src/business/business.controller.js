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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessController = void 0;
const common_1 = require("@nestjs/common");
const business_service_1 = require("./business.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let BusinessController = class BusinessController {
    businessService;
    constructor(businessService) {
        this.businessService = businessService;
    }
    getDashboard(req) {
        return this.businessService.getDashboardData(req.user.id);
    }
    createBulkOrders(req, orders) {
        return this.businessService.createBulkOrders(req.user.id, orders || []);
    }
    getAnalytics(req) {
        return this.businessService.getAnalytics(req.user.id);
    }
    updateProfile(req, updateData) {
        return this.businessService.updateProfile(req.user.id, updateData);
    }
    getAllDeliveries(req) {
        return this.businessService.getAllDeliveries(req.user.id);
    }
};
exports.BusinessController = BusinessController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Post)('orders/bulk'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('orders')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "createBulkOrders", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Put)('profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BusinessController.prototype, "getAllDeliveries", null);
exports.BusinessController = BusinessController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('business'),
    __metadata("design:paramtypes", [business_service_1.BusinessService])
], BusinessController);
//# sourceMappingURL=business.controller.js.map