import { Module } from '@nestjs/common';
import { TrackingGateway } from './tracking.gateway';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [OrdersModule],
  providers: [TrackingGateway],
  exports: [TrackingGateway],
})
export class TrackingModule {}
