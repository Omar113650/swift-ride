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

          //  1) Update ride metadata (اختياري)
          /*
          await this.prisma.ride.update({
            where: { id: rideId },
            data: {
              distance,
              selectedPrice: estimatedPrice,
            },
          });
          */

          //  2) notify nearby drivers (event or queue)
          await this.queue.add('notify-drivers', {
            rideId,
            pickup,
          });

          //  3) analytics/logging
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

        // NOTIFY DRIVERS
        case 'notify-drivers': {
          const { rideId, pickup } = job.data;

          this.logger.log(`📡 Notifying drivers for ride ${rideId}`);

          // const drivers = await this.geoService.findNearbyDrivers(pickup);

          //  send socket لكل driver
          /*
          drivers.forEach((driver) => {
            this.socketService.emitToDriver(driver.id, 'new-ride', {
              rideId,
              pickup,
            });
          });
          */

          return { notified: true };
        }

        //  PAYMENT PROCESS
        case 'process-payment': {
          const { rideId, amount, method } = job.data;

          this.logger.log(`💰 Processing payment for ride ${rideId}`);

          //  integrate Stripe / Paymob هنا
          /*
          const result = await this.paymentService.charge({
            amount,
            method,
          });
          */

          // update DB
          /*
          await this.prisma.payment.update({
            where: { rideId },
            data: {
              status: 'COMPLETED',
            },
          });
          */

          return { paid: true };
        }

        // SEND NOTIFICATION
        case 'send-notification': {
          const { userId, title, message } = job.data;

          this.logger.log(` Sending notification to ${userId}`);

          /*
          await this.notificationService.send({
            userId,
            title,
            message,
          });
          */

          return { sent: true };
        }

        // UNKNOWN JOB
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
