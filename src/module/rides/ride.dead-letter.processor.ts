import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

@Processor('ride-dead-letter')
export class RideDeadLetterConsumer extends WorkerHost {
  private readonly logger = new Logger(RideDeadLetterConsumer.name);

  async process(job: Job<any>) {
    this.logger.error(`💀 DEAD LETTER JOB RECEIVED`);

    this.logger.error({
      job: job.name,
      data: job.data,
    });

    // 💡 هنا تعمل:
    // - save in DB logs
    // - send Slack alert
    // - admin dashboard retry

    return { handled: true };
  }
}