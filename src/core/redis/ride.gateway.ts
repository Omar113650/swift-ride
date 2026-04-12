import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class RideGateway {
  @WebSocketServer()
  server!: Server;

  constructor(
    @Inject('REDIS') private readonly redis: any,
  ) {}

  // 🚗 Driver Location Update
  @SubscribeMessage('driver-location')
  async handleDriverLocation(@MessageBody() data: any) {
    const { driverId, rideId, lat, lng } = data;

    // 1️⃣ Last location
    await this.redis.set(
      `driver:${driverId}:location`,
      JSON.stringify({ lat, lng, time: Date.now() }),
    );

    // 2️⃣ GEO update (nearby system)
    await this.redis.geoAdd('drivers:available', {
      longitude: lng,
      latitude: lat,
      member: driverId,
    });

    // 3️⃣ Route history
    await this.redis.rPush(
      `ride:${rideId}:coords`,
      JSON.stringify({ lat, lng }),
    );

    // 4️⃣ Broadcast to ride room
    this.server.to(`ride:${rideId}`).emit('driver-location', {
      driverId,
      lat,
      lng,
    });
  }

  // 👨‍👩‍👦 Join ride room
  @SubscribeMessage('join-ride')
  handleJoinRide(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(`ride:${data.rideId}`);
  }

  // 📍 Get last location
  @SubscribeMessage('get-last-location')
  async getLastLocation(@MessageBody() data: any) {
    const location = await this.redis.get(
      `driver:${data.driverId}:location`,
    );

    return location ? JSON.parse(location) : null;
  }
}