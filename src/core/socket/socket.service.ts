import { Injectable } from '@nestjs/common';
import { AppGateway } from '../../gateways/chat.gateway';

@Injectable()
export class SocketService {
  constructor(private readonly gateway: AppGateway) {}

  // =========================
  // SEND TO DRIVER
  // =========================
  emitToDriver(driverId: string, event: string, data: any) {
    this.gateway.emitToUser(driverId, event, data);
  }

  // =========================
  // SEND TO USER
  // =========================
  emitToUser(userId: string, event: string, data: any) {
    this.gateway.emitToUser(userId, event, data);
  }

  // =========================
  // CHAT
  // =========================
  sendMessage(fromId: string, toId: string, message: string) {
    this.gateway.emitToUser(toId, 'receive_message', {
      from: fromId,
      message,
    });
  }
}