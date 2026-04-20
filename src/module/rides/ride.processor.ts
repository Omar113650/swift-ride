// import { Processor, WorkerHost } from '@nestjs/bullmq';
// import { Job } from 'bullmq';
// import { Injectable } from '@nestjs/common';

// @Processor('ride')
// @Injectable()
// export class RideProcessor extends WorkerHost {
//   async process(job: Job): Promise<any> {
//     switch (job.name) {
//       case 'ride-request': {
//         const { userId, pickup, destination } = job.data;

//         console.log('🚗 Processing ride request...');

//         // 1. save ride in DB (Prisma)
//         // 2. find nearest driver
//         // 3. notify driver via socket

//         return {
//           status: 'processed',
//         };
//       }
//     }
//   }
// }





































































import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';

@Processor('ride')
@Injectable()
export class RideProcessor extends WorkerHost {
  private readonly logger = new Logger(RideProcessor.name);

  async process(job: Job): Promise<any> {
    try {
      this.logger.log(`🔥 Processing job: ${job.name}`);

      switch (job.name) {

        // 🚗 نفس اسم اللي انت بتعمله add في الكيو
        case 'ride-created': {
          const {
            rideId,
            riderId,
            pickup,
            destination,
            distance,
            estimatedTimeMinutes,
            estimatedPrice,
          } = job.data;

          this.logger.log(`🚗 Handling ride-created: ${rideId}`);

          // 👇 هنا ممكن تعمل أي logic زيادة
          // مثال:
          // 1. logging
          // 2. analytics
          // 3. notifications

          return {
            status: 'processed',
            rideId,
          };
        }

        default:
          this.logger.warn(`⚠️ Unknown job: ${job.name}`);
          return {
            status: 'ignored',
            job: job.name,
          };
      }
    } catch (error) {
      this.logger.error(`❌ Job failed`, error);

      throw error; // مهم عشان retry يشتغل
    }
  }
}