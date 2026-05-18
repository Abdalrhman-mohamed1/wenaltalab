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
exports.DriverController = void 0;
const common_1 = require("@nestjs/common");
const driver_service_1 = require("./driver.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const client_1 = require("@prisma/client");
let DriverController = class DriverController {
    driverService;
    constructor(driverService) {
        this.driverService = driverService;
    }
    getDashboard(req) {
        return this.driverService.getDashboardData(req.user.id);
    }
    getAvailableOrders() {
        return this.driverService.getAvailableOrders();
    }
    getActiveOrders(req) {
        return this.driverService.getActiveOrders(req.user.id);
    }
    getCompletedOrders(req) {
        return this.driverService.getCompletedOrders(req.user.id);
    }
    getEarningsSummary(req) {
        return this.driverService.getEarningsSummary(req.user.id);
    }
    acceptOrder(req, orderId) {
        return this.driverService.acceptOrder(req.user.id, orderId);
    }
    rejectOrder(req, orderId) {
        return this.driverService.rejectOrder(req.user.id, orderId);
    }
    updateOrderStatus(req, orderId, status) {
        return this.driverService.updateOrderStatus(req.user.id, orderId, status);
    }
};
exports.DriverController = DriverController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('available'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "getAvailableOrders", null);
__decorate([
    (0, common_1.Get)('active'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "getActiveOrders", null);
__decorate([
    (0, common_1.Get)('completed'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "getCompletedOrders", null);
__decorate([
    (0, common_1.Get)('earnings'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "getEarningsSummary", null);
__decorate([
    (0, common_1.Post)('accept/:orderId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "acceptOrder", null);
__decorate([
    (0, common_1.Post)('reject/:orderId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "rejectOrder", null);
__decorate([
    (0, common_1.Patch)('status/:orderId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('orderId')),
    __param(2, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "updateOrderStatus", null);
exports.DriverController = DriverController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('driver'),
    __metadata("design:paramtypes", [driver_service_1.DriverService])
], DriverController);
//# sourceMappingURL=driver.controller.js.map