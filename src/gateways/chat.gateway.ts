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

type Role = 'DRIVER' | 'RIDER';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // userId -> { socketId, role }
  private clientsMap = new Map<
    string,
    { socketId: string; role: Role }
  >();

  // =========================
  // CONNECT
  // =========================
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

    console.log(`${role} connected: ${userId}`);
  }

  // =========================
  // DISCONNECT
  // =========================
  handleDisconnect(client: Socket) {
    for (const [userId, data] of this.clientsMap.entries()) {
      if (data.socketId === client.id) {
        this.clientsMap.delete(userId);
        console.log(`Disconnected: ${userId}`);
        break;
      }
    }
  }

  // =========================
  // GET CLIENT
  // =========================
  getClient(userId: string) {
    return this.clientsMap.get(userId);
  }

  // =========================
  // EMIT TO USER (🔥 الأساس)
  // =========================
  emitToUser(userId: string, event: string, data: any) {
    const client = this.getClient(userId);
    if (!client) return;

    this.server.to(client.socketId).emit(event, data);
  }

  // =========================
  // CHAT
  // =========================
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

  // =========================
  // BROADCAST
  // =========================
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}