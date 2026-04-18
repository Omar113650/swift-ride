// import { Processor, WorkerHost } from '@nestjs/bullmq';
// import { Job } from 'bullmq';
// import { Logger } from '@nestjs/common';
// import { PrismaService } from '../../../core/prisma/prisma.service';
// import { SocketService } from '../../../core/socket/socket.service';

// @Processor('ride')
// export class RideConsumer extends WorkerHost {
//   private readonly logger = new Logger(RideConsumer.name);

//   constructor(
//     private prisma: PrismaService,
//     private socketService: SocketService,
//   ) {
//     super();
//   }

//   async process(job: Job<any, any, string>): Promise<any> {
//     this.logger.log(`🔥 Processing job: ${job.name}`);

//     switch (job.name) {
//       case 'ride-created':
//         return this.handleRideCreated(job.data);

//       default:
//         this.logger.warn(`❗ Unknown job: ${job.name}`);
//     }
//   }

//   async handleRideCreated(data: any) {
//     this.logger.log(`🚗 Handling ride: ${data.rideId}`);

//     const { pickup, distance, estimatedTimeMinutes, estimatedPrice } = data;

//     // 🔥 نجيب أقرب drivers
//     const nearbyDrivers = await this.prisma.$queryRaw<
//       { driverId: string; distance: number }[]
//     >`
//       SELECT
//         dl."driverId",
//         (
//           6371 * acos(
//             cos(radians(${pickup.lat})) *
//             cos(radians(dl."lat")) *
//             cos(radians(dl."lng") - radians(${pickup.lng})) +
//             sin(radians(${pickup.lat})) *
//             sin(radians(dl."lat"))
//           )
//         ) AS distance
//       FROM "driver_locations" dl
//       ORDER BY distance
//       LIMIT 10;
//     `;

//     this.logger.log(`📍 Found ${nearbyDrivers.length} drivers`);

//     // 🔥 نبعت للـ drivers
//     for (const driver of nearbyDrivers) {
//       this.logger.debug(`📡 Sending to driver: ${driver.driverId}`);

//       this.socketService.emitToDriver(driver.driverId, 'new_ride', {
//         rideId: data.rideId,
//         pickup,
//         destination: data.destination,
//         distance,
//         estimatedTimeMinutes,
//         estimatedPrice,
//       });
//     }

//     return { success: true };
//   }
// }









































// ✔ Retry mechanism
// ✔ Dead Letter Queue (failed handling)
// ✔ Proper BullMQ config
// ✔ Worker safe error handling
// ✔ Queue add options









import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { SocketService } from '../../../core/socket/socket.service';

@Processor('ride')
export class RideConsumer extends WorkerHost {
  private readonly logger = new Logger(RideConsumer.name);

  constructor(
    private prisma: PrismaService,
    private socketService: SocketService,

    // 💀 Dead Letter Queue
    @InjectQueue('ride-dead-letter')
    private readonly deadLetterQueue: Queue,
  ) {
    super();
  }

  // 🚀 Main Worker Entry
  async process(job: Job<any, any, string>): Promise<any> {
    try {
      this.logger.log(
        `🔥 Processing job: ${job.name} (attempt ${job.attemptsMade + 1})`,
      );

      switch (job.name) {
        case 'ride-created':
          return await this.handleRideCreated(job.data);

        default:
          throw new Error(`❗ Unknown job: ${job.name}`);
      }
    } catch (error) {
      this.logger.error(
        `❌ Job failed: ${job.id} | attempt ${job.attemptsMade + 1}`,
        error instanceof Error ? error.stack : String(error),
      );

      // 💀 Send to Dead Letter Queue after final retry
      if (job.attemptsMade + 1 >= 5) {
        await this.deadLetterQueue.add('ride-dead-letter', {
          originalJob: job.name,
          data: job.data,
          error: error instanceof Error ? error.message : String(error),
          failedAt: new Date(),
        });

        this.logger.error(`💀 Sent to Dead Letter Queue: ${job.id}`);
      }

      throw error; // important for BullMQ retry
    }
  }

  // 🚗 Main Ride Logic
  async handleRideCreated(data: any) {
    this.logger.log(`🚗 Handling ride: ${data.rideId}`);

    const { pickup, distance, estimatedTimeMinutes, estimatedPrice } = data;

    // 📍 Find nearest drivers
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

    // 📡 Notify drivers
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











































// 🚀 كده أنت عندك:
// 🔁 Retry System
// 5 attempts (configured في queue setup)
// exponential backoff
// 💀 Dead Letter Queue
// بعد الفشل النهائي
// يتحفظ فيه كل failed jobs
// ⚡ Production Worker
// safe error handling
// logging
// scalable design
// 🧠 Flow النهائي
// Job → Worker
//      ↓
// success → notify drivers
//      ↓
// fail → retry 5 times
//      ↓
// final fail → dead-letter queue 💀