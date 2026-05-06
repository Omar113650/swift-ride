import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { SocketService } from '../../../core/socket/socket.service';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
@Processor('ride')
@Injectable()
export class RideProcessor extends WorkerHost {
  private readonly logger = new Logger(RideProcessor.name);

  constructor(
    @InjectQueue('ride') private readonly queue: Queue,
    private readonly prisma: PrismaService,
    private readonly socketService: SocketService,
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    try {
      this.logger.log(` Processing job: ${job.name}`);

      switch (job.name) {
        //  RIDE CREATED
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

          this.logger.log(` Handling ride-created: ${rideId}`);

          await this.queue.add('notify-drivers', {
            rideId,
            pickup,
          });

          this.logger.log({
            event: 'ride_created',
            rideId,
            distance,
            estimatedTimeMinutes,
            estimatedPrice,
          });

          return {
            status: 'processed',
            rideId,
          };
        }

        case 'notify-drivers': {
          const { rideId, pickup } = job.data;

          this.logger.log(`📡 Notifying drivers for ride ${rideId}`);

          return { notified: true };
        }

        case 'send-notification': {
          const { userId, title, message } = job.data;

          this.logger.log(` Sending notification to ${userId}`);

          return { sent: true };
        }

        default:
          this.logger.warn(`Unknown job: ${job.name}`);
          return {
            status: 'ignored',
            job: job.name,
          };
      }
    } catch (error: any) {
      this.logger.error(` Job failed`, {
        job: job.name,
        data: job.data,
        error: error.message,
        stack: error.stack,
      });

      throw error;
    }
  }
}
