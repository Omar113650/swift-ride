// import { Injectable } from '@nestjs/common';
// import { Inject } from '@nestjs/common';
// import { Server } from 'socket.io';

// @Injectable()
// export class RideTrackingService {
//   constructor(@Inject('REDIS') private readonly redis: any) {}

//   // 🚗 update driver location
//   async updateDriverLocation(
//     data: { driverId: string; rideId: string; lat: number; lng: number },
//     server: Server,
//   ) {
//     const { driverId, rideId, lat, lng } = data;

//     // 1️⃣ last location cache
//     await this.redis.set(
//       `driver:${driverId}:location`,
//       JSON.stringify({ lat, lng, time: Date.now() }),
//     );

//     // 2️⃣ GEO index
//     await this.redis.geoAdd('drivers:available', {
//       longitude: lng,
//       latitude: lat,
//       member: driverId,
//     });

//     // 3️⃣ route history (trim to prevent memory leak)
//     await this.redis.rPush(
//       `ride:${rideId}:coords`,
//       JSON.stringify({ lat, lng }),
//     );

//     await this.redis.lTrim(`ride:${rideId}:coords`, -500, -1);

//     // 4️⃣ realtime broadcast
//     server.to(`ride:${rideId}`).emit('driver-location', {
//       driverId,
//       lat,
//       lng,
//     });
//   }

//   // 📍 last location
//   async getLastLocation(driverId: string) {
//     const location = await this.redis.get(
//       `driver:${driverId}:location`,
//     );

//     return location ? JSON.parse(location) : null;
//   }
// }














import { Injectable, Inject } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class RideTrackingService {
  constructor(@Inject('REDIS') private readonly redis: any) {}

  async updateDriverLocation(
    data: { driverId: string; rideId: string; lat: number; lng: number },
    server: Server,
  ) {
    const { driverId, rideId, lat, lng } = data;

    // 📍 last location
    await this.redis.set(
      `driver:${driverId}:location`,
      JSON.stringify({ lat, lng, time: Date.now() }),
    );

    // 🌍 geo index
    await this.redis.geoAdd('drivers:available', {
      longitude: lng,
      latitude: lat,
      member: driverId,
    });

    // 🛣️ route history
    await this.redis.rPush(
      `ride:${rideId}:coords`,
      JSON.stringify({ lat, lng }),
    );

    await this.redis.lTrim(`ride:${rideId}:coords`, -500, -1);

    // 📡 realtime
    server.to(`ride:${rideId}`).emit('driver-location', {
      driverId,
      lat,
      lng,
    });
  }

  async getLastLocation(driverId: string) {
    const data = await this.redis.get(`driver:${driverId}:location`);
    return data ? JSON.parse(data) : null;
  }
}