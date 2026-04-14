import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { SocketService } from '../../../core/socket/socket.service';

@Processor('ride')
export class RideConsumer extends WorkerHost {
  private readonly logger = new Logger(RideConsumer.name);

  constructor(
    private prisma: PrismaService,
    private socketService: SocketService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`🔥 Processing job: ${job.name}`);

    switch (job.name) {
      case 'ride-created':
        return this.handleRideCreated(job.data);

      default:
        this.logger.warn(`❗ Unknown job: ${job.name}`);
    }
  }

  async handleRideCreated(data: any) {
    this.logger.log(`🚗 Handling ride: ${data.rideId}`);

    const { pickup, distance, estimatedTimeMinutes, estimatedPrice } = data;

    // 🔥 نجيب أقرب drivers
    const nearbyDrivers = await this.prisma.$queryRaw<
      { driverId: string; distance: number }[]
    >`
      SELECT 
        dl."driverId",
        (
          6371 * acos(
            cos(radians(${pickup.lat})) * 
            cos(radians(dl."lat")) * 
            cos(radians(dl."lng") - radians(${pickup.lng})) + 
            sin(radians(${pickup.lat})) * 
            sin(radians(dl."lat"))
          )
        ) AS distance
      FROM "driver_locations" dl
      ORDER BY distance
      LIMIT 10;
    `;

    this.logger.log(`📍 Found ${nearbyDrivers.length} drivers`);

    // 🔥 نبعت للـ drivers
    for (const driver of nearbyDrivers) {
      this.logger.debug(`📡 Sending to driver: ${driver.driverId}`);

      this.socketService.emitToDriver(driver.driverId, 'new_ride', {
        rideId: data.rideId,
        pickup,
        destination: data.destination,
        distance,
        estimatedTimeMinutes,
        estimatedPrice,
      });
    }

    return { success: true };
  }
}