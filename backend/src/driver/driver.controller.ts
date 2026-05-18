import { Controller, Get, Post, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { DriverService } from './driver.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeliveryStatus } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('dashboard')
  getDashboard(@Request() req) {
    return this.driverService.getDashboardData(req.user.id);
  }

  @Get('available')
  getAvailableOrders() {
    return this.driverService.getAvailableOrders();
  }

  @Get('active')
  getActiveOrders(@Request() req) {
    return this.driverService.getActiveOrders(req.user.id);
  }

  @Get('completed')
  getCompletedOrders(@Request() req) {
    return this.driverService.getCompletedOrders(req.user.id);
  }

  @Get('earnings')
  getEarningsSummary(@Request() req) {
    return this.driverService.getEarningsSummary(req.user.id);
  }

  @Post('accept/:orderId')
  acceptOrder(@Request() req, @Param('orderId') orderId: string) {
    return this.driverService.acceptOrder(req.user.id, orderId);
  }

  @Post('reject/:orderId')
  rejectOrder(@Request() req, @Param('orderId') orderId: string) {
    return this.driverService.rejectOrder(req.user.id, orderId);
  }

  @Patch('status/:orderId')
  updateOrderStatus(
    @Request() req,
    @Param('orderId') orderId: string,
    @Body('status') status: DeliveryStatus,
  ) {
    return this.driverService.updateOrderStatus(req.user.id, orderId, status);
  }
}
