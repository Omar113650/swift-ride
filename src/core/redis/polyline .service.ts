import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import polyline from '@mapbox/polyline';

@Injectable()
export class RidesService {
  constructor(
    private readonly prisma: any,
  ) {}

  async getRideRoute(rideId: string) {
    // 1️⃣ Get ride from DB
    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
    });

    // 2️⃣ Safety check
    if (!ride || !ride.route) {
      return [];
    }

    // 3️⃣ Decode polyline
    const points = polyline.decode(ride.route);

    // 4️⃣ Return coordinates
    return points;
  }
}