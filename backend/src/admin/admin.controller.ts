import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  getUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('drivers')
  getDrivers() {
    return this.adminService.getAllDrivers();
  }

  @Patch('drivers/:id/verify')
  verifyDriver(@Param('id') id: string) {
    return this.adminService.verifyDriver(id);
  }

  @Patch('users/:id/active')
  toggleUserActive(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.adminService.toggleUserActive(id, isActive);
  }

  @Get('orders')
  getOrders() {
    return this.adminService.getAllOrders();
  }

  @Get('businesses')
  getBusinesses() {
    return this.adminService.getAllBusinesses();
  }
}
