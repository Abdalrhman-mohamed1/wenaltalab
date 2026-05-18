import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryStatus } from '@prisma/client';
export declare class TrackingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private prisma;
    server: Server;
    constructor(prisma: PrismaService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(room: string, client: Socket): {
        event: string;
        room: string;
    };
    handleLocationUpdate(data: {
        orderId: string;
        lat: number;
        lng: number;
        driverId: string;
    }, client: Socket): Promise<void>;
    handleStatusUpdate(data: {
        orderId: string;
        status: DeliveryStatus;
    }, client: Socket): Promise<void>;
}
