// import {
//   WebSocketGateway,
//   SubscribeMessage,
//   MessageBody,
//   ConnectedSocket,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { Inject } from '@nestjs/common';

// @WebSocketGateway({ cors: true })
// export class RideGateway {
//   @WebSocketServer()
//   server!: Server;

//   constructor(
//     @Inject('REDIS') private readonly redis: any,
//   ) {}

//   // 🚗 Driver Location Update
//   @SubscribeMessage('driver-location')
//   async handleDriverLocation(@MessageBody() data: any) {
//     const { driverId, rideId, lat, lng } = data;

//     // 1️⃣ Last location
//     await this.redis.set(
//       `driver:${driverId}:location`,
//       JSON.stringify({ lat, lng, time: Date.now() }),
//     );

//     // 2️⃣ GEO update (nearby system)
//     await this.redis.geoAdd('drivers:available', {
//       longitude: lng,
//       latitude: lat,
//       member: driverId,
//     });

//     // 3️⃣ Route history
//     await this.redis.rPush(
//       `ride:${rideId}:coords`,
//       JSON.stringify({ lat, lng }),
//     );

//     // 4️⃣ Broadcast to ride room
//     this.server.to(`ride:${rideId}`).emit('driver-location', {
//       driverId,
//       lat,
//       lng,
//     });
//   }

//   // 👨‍👩‍👦 Join ride room
//   @SubscribeMessage('join-ride')
//   handleJoinRide(
//     @MessageBody() data: any,
//     @ConnectedSocket() socket: Socket,
//   ) {
//     socket.join(`ride:${data.rideId}`);
//   }

//   // 📍 Get last location
//   @SubscribeMessage('get-last-location')
//   async getLastLocation(@MessageBody() data: any) {
//     const location = await this.redis.get(
//       `driver:${data.driverId}:location`,
//     );

//     return location ? JSON.parse(location) : null;
//   }
// }










import { Injectable } from '@nestjs/common';
import polyline from '@mapbox/polyline';
import { Inject } from '@nestjs/common';

@Injectable()
export class RidesService {
  constructor(
    private readonly prisma: any,
    @Inject('REDIS') private readonly redis: any,
  ) {}

  // 🧾 finish ride
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

  // 🗺️ get route (cache + DB)
  async getRideRoute(rideId: string) {
    const cacheKey = `ride:${rideId}:route`;

    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride?.route) return [];

    const points = polyline.decode(ride.route);

    await this.redis.set(cacheKey, JSON.stringify(points), {
      EX: 3600,
    });

    return points;
  }
}















// 1. Ride Tracking (Gateway)
// driver-location event
// تخزين آخر مكان في Redis
// حفظ route history
// broadcast للـ room


// 2. Finish Ride Service
// بتجمع coordinates من Redis
// بتعمل encode بـ polyline
// بتحفظ route في DB
// بتمسح cache


// 🗺️ 3. Get Route
// Redis cache
// fallback DB
// decode polyline