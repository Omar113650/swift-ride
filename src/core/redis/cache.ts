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

    // 1️⃣ Check Redis Cache first
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // 2️⃣ Get from Database
    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
    });

    // 3️⃣ Safety check
    if (!ride || !ride.route) {
      return [];
    }

    // 4️⃣ Decode polyline
    const points = polyline.decode(ride.route);

    // 5️⃣ Save to Redis cache
    await this.redis.set(
      cacheKey,
      JSON.stringify(points),
      {
        EX: 3600, // 1 hour cache
      },
    );

    // 6️⃣ Return result
    return points;
  }
}