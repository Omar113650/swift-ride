import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Inject } from '@nestjs/common';
import polyline from '@mapbox/polyline';

@WebSocketGateway({ cors: true })
@Injectable()
export class RideService {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly prisma: any,
    @Inject('REDIS') private readonly redis: any,
  ) {}

  // 🚗 Driver sends live location
  @SubscribeMessage('driver-location')
  async handleDriverLocation(@MessageBody() data: any) {
    const { driverId, rideId, lat, lng } = data;

    // 🟢 Save last location in Redis
    await this.redis.set(
      `driver:${driverId}:location`,
      JSON.stringify({ lat, lng, time: Date.now() }),
    );

    // 🟡 Geo indexing for nearby drivers
    await this.redis.geoAdd('drivers:available', {
      longitude: lng,
      latitude: lat,
      member: driverId,
    });

    // 🔵 Save route history
    await this.redis.rPush(
      `ride:${rideId}:coords`,
      JSON.stringify({ lat, lng }),
    );

    // 🔴 Emit live location to ride room
    this.server.to(`ride:${rideId}`).emit('driver-location', {
      driverId,
      lat,
      lng,
    });
  }

  // 👥 Join ride room
  @SubscribeMessage('join-ride')
  handleJoinRide(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(`ride:${data.rideId}`);
  }

  // 📍 Get last driver location
  @SubscribeMessage('get-last-location')
  async getLastLocation(@MessageBody() data: any) {
    const location = await this.redis.get(
      `driver:${data.driverId}:location`,
    );

    return location ? JSON.parse(location) : null;
  }

  // 🧾 Finish ride (compress route)
  async finishRide(rideId: string) {
    const coords = await this.redis.lRange(
      `ride:${rideId}:coords`,
      0,
      -1,
    );

    const points = coords.map((c: any) => {
      const p = JSON.parse(c);
      return [p.lat, p.lng];
    });

    const encodedRoute = polyline.encode(points);

    await this.prisma.ride.update({
      where: { id: rideId },
      data: { route: encodedRoute },
    });

    // cleanup
    await this.redis.del(`ride:${rideId}:coords`);

    return { route: encodedRoute };
  }

  // 🗺️ Get ride route (cache + DB)
  async getRideRoute(rideId: string) {
    const cacheKey = `ride:${rideId}:route`;

    // 🔥 check cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    // 🟡 fallback DB
    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride?.route) return [];

    const points = polyline.decode(ride.route);

    // 💾 save to cache
    await this.redis.set(cacheKey, JSON.stringify(points), {
      EX: 3600,
    });

    return points;
  }
}