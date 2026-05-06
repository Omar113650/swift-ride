import { Injectable, Inject, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RideTrackingService {
  private readonly logger = new Logger(RideTrackingService.name);

  constructor(
    @Inject('REDIS') private readonly redis: any,

  ) {}

  async updateDriverLocation(data: {
    driverId: string;
    rideId: string;
    lat: number;
    lng: number;
  }) {
    const { driverId, rideId, lat, lng } = data;

    try {
      //  Last location
      await this.redis.set(
        `driver:${driverId}:location`,
        JSON.stringify({ lat, lng, time: Date.now() }),
      );

      //  GEO index drivers available
      await this.redis.geoAdd('drivers:available', {
        longitude: lng,
        latitude: lat,
        member: driverId,
      });

      //  Ride route history
      await this.redis.rPush(
        `ride:${rideId}:coords`,
        JSON.stringify({ lat, lng }),
      );

      await this.redis.lTrim(`ride:${rideId}:coords`, -500, -1);

      this.logger.log(
        ` Location updated for driver ${driverId} | ride ${rideId}`,
      );

      return { success: true };
    } catch (err) {
      this.logger.error(' updateDriverLocation failed', err);
      throw err;
    }
  }

  async getLastLocation(driverId: string) {
    const data = await this.redis.get(`driver:${driverId}:location`);
    return data ? JSON.parse(data) : null;
  }
}
