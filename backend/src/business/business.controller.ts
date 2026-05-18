import { Controller, Get, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('dashboard')
  getDashboard(@Request() req) {
    return this.businessService.getDashboardData(req.user.id);
  }

  @Post('orders/bulk')
  createBulkOrders(@Request() req, @Body('orders') orders: any[]) {
    return this.businessService.createBulkOrders(req.user.id, orders || []);
  }

  @Get('analytics')
  getAnalytics(@Request() req) {
    return this.businessService.getAnalytics(req.user.id);
  }

  @Put('profile')
  updateProfile(@Request() req, @Body() updateData: any) {
    return this.businessService.updateProfile(req.user.id, updateData);
  }

  @Get('orders')
  getAllDeliveries(@Request() req) {
    return this.businessService.getAllDeliveries(req.user.id);
  }
}
