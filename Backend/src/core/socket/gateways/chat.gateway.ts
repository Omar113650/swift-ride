import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { RideTrackingService } from '../../../module/rides/track-live location/ride-tracking.service';

type Role = 'DRIVER' | 'RIDER';

@WebSocketGateway({
  cors: { origin: '*' },
})
@Injectable()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly rideTrackingService: RideTrackingService) {}

  // userId -> { socketId, role }
  private clientsMap = new Map<string, { socketId: string; role: Role }>();

  // CONNECT
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    const role = client.handshake.query.role as Role;

    if (!userId || !role) {
      client.disconnect();
      return;
    }

    this.clientsMap.set(userId, {
      socketId: client.id,
      role,
    });
  }
  handleDisconnect(client: Socket) {
    for (const [userId, data] of this.clientsMap.entries()) {
      if (data.socketId === client.id) {
        this.clientsMap.delete(userId);
        break;
      }
    }
  }

  getClient(userId: string) {
    return this.clientsMap.get(userId);
  }

  emitToUser(userId: string, event: string, data: any) {
    const client = this.getClient(userId);
    if (!client) {
      console.log(`⚠️ User not connected: ${userId}`);
      return;
    }

    this.server.to(client.socketId).emit(event, data);
  }

  emitToAllDrivers(event: string, data: any) {
    for (const [, client] of this.clientsMap.entries()) {
      if (client.role === 'DRIVER') {
        this.server.to(client.socketId).emit(event, data);
      }
    }
  }

  @SubscribeMessage('send_message')
  handleMessage(
    @MessageBody()
    data: {
      toUserId: string;
      message: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const sender = [...this.clientsMap.entries()].find(
      ([, value]) => value.socketId === client.id,
    );

    if (!sender) return;

    const [fromUserId] = sender;

    this.emitToUser(data.toUserId, 'receive_message', {
      from: fromUserId,
      message: data.message,
    });
  }

  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  @SubscribeMessage('driver-location')
  async handleLocation(@MessageBody() data: any) {
    console.log(' DRIVER LOCATION RECEIVED:', data);

    await this.rideTrackingService.updateDriverLocation(data);
  }
}
