import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export declare class RideDeadLetterConsumer extends WorkerHost {
    private readonly logger;
    process(job: Job<any>): Promise<{
        skipped: boolean;
        retried?: undefined;
        failed?: undefined;
    } | {
        retried: boolean;
        skipped?: undefined;
        failed?: undefined;
    } | {
        failed: boolean;
        skipped?: undefined;
        retried?: undefined;
    }>;
}
