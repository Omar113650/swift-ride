// import { Injectable } from '@nestjs/common';
// import { RideCacheService } from '../core/redis/ride-cache.service';
// import { PolylineService } from './polyline.service';

// @Injectable()
// export class RideRouteService {
//   constructor(
//     private readonly prisma: any,
//     private readonly cache: RideCacheService,
//     private readonly polyline: PolylineService,
//   ) {}

//   // 🗺️ get route (cache + db)
//   async getRideRoute(rideId: string) {
//     const cacheKey = `ride:${rideId}:route`;

//     const cached = await this.cache.get(cacheKey);
//     if (cached) return cached;

//     const ride = await this.prisma.ride.findUnique({
//       where: { id: rideId },
//     });

//     if (!ride?.route) return [];

//     const points = this.polyline.decode(ride.route);

//     await this.cache.set(cacheKey, points, 3600);

//     return points;
//   }

//   // 🧾 finish ride
//   async finishRide(rideId: string) {
//     const coords = await this.cache['redis'].lRange(
//       `ride:${rideId}:coords`,
//       0,
//       -1,
//     );

//     const points = coords.map((c: any) => {
//       const p = JSON.parse(c);
//       return [p.lat, p.lng];
//     });

//     const encoded = this.polyline.encode(points);

//     await this.prisma.ride.update({
//       where: { id: rideId },
//       data: { route: encoded },
//     });

//     await this.cache['redis'].del(`ride:${rideId}:coords`);

//     return { route: encoded };
//   }
// }