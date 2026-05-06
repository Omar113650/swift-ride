import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('ride-dead-letter')
export class RideDeadLetterConsumer extends WorkerHost {
  private readonly logger = new Logger(RideDeadLetterConsumer.name);

  async process(job: Job<any>) {
    this.logger.error(` DEAD LETTER JOB RECEIVED`);

    this.logger.error({
      job: job.name,
      data: job.data,
      failedReason: job.failedReason,
      attempts: job.attemptsMade,
      stack: job.stacktrace,
    });

  
    if (job.failedReason?.includes('Validation')) {
      this.logger.warn(' Skipping retry بسبب validation error');
      return { skipped: true };
    }

    //  2) retry max 3 مرات
    if (job.attemptsMade < 3) {
      this.logger.warn(` Retrying job ${job.name}`);
      await job.retry();
      return { retried: true };
    }


    this.logger.error(`Job permanently failed: ${job.name}`);

    return { failed: true };
  }
}
