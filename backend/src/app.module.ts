import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { TrackingModule } from './tracking/tracking.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';
import { DriverModule } from './driver/driver.module';
import { BusinessModule } from './business/business.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    OrdersModule,
    TrackingModule,
    AdminModule,
    PaymentsModule,
    DriverModule,
    BusinessModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
