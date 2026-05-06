import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import polyline from '@mapbox/polyline';

@Injectable()
export class RidesService {
  constructor(
    @Inject('REDIS') private readonly redis: any,
    private readonly prisma: any,
  ) {}

  async getRideRoute(rideId: string) {
    const cacheKey = `ride:${rideId}:route`;

    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride || !ride.route) {
      return [];
    }

    const points = polyline.decode(ride.route);
// add result in redis
    await this.redis.set(cacheKey, JSON.stringify(points), {
      EX: 3600,
    });

    return points;
  }
}
