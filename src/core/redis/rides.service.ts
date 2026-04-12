import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import polyline from '@mapbox/polyline';

@Injectable()
export class RidesService {
  constructor(
    @Inject('REDIS') private readonly redis: any,
    private readonly prisma: any,
  ) {}

  // 🧾 Finish Ride (Compress Route)
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

    await this.redis.del(`ride:${rideId}:coords`);

    return { route: encodedRoute };
  }

  // 🗺️ Get Route (Cache + DB)
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