import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket, 
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryStatus } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Driver emits this to join their own room or a specific order room
  @SubscribeMessage('join_room')
  handleJoinRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.join(room);
    return { event: 'joined', room };
  }

  // Driver emits their live location
  @SubscribeMessage('update_location')
  async handleLocationUpdate(
    @MessageBody() data: { orderId: string, lat: number, lng: number, driverId: string },
    @ConnectedSocket() client: Socket
  ) {
    // 1. Broadcast to anyone tracking this order (e.g. customer)
    this.server.to(`order_${data.orderId}`).emit('location_updated', data);
    
    // 2. Persist tracking location to DB
    await this.prisma.tracking.create({
      data: {
        orderId: data.orderId,
        driverId: data.driverId,
        lat: data.lat,
        lng: data.lng,
        status: DeliveryStatus.IN_TRANSIT,
      }
    });
  }

  // Emit status change to customer
  @SubscribeMessage('update_status')
  async handleStatusUpdate(
    @MessageBody() data: { orderId: string, status: DeliveryStatus },
    @ConnectedSocket() client: Socket
  ) {
    this.server.to(`order_${data.orderId}`).emit('status_updated', data);
  }
}
