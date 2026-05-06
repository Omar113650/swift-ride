import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import polyline from '@mapbox/polyline';

@Injectable()
export class RidesService {
  constructor(
    private readonly prisma: any,
  ) {}

  async getRideRoute(rideId: string) {
    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride || !ride.route) {
      return [];
    }

    const points = polyline.decode(ride.route);

    return points;
  }
}







// https://cloud.redis.io/#/