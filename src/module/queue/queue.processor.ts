




// import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
// import { Logger } from '@nestjs/common';
// import { Job } from 'bullmq';
// import { SyncService } from '../sync/sync.service';
// import { SYNC_QUEUE, SyncJobData, SyncJobType } from './queue.constants';

// @Processor(SYNC_QUEUE)
// export class QueueProcessor extends WorkerHost {
//   private readonly logger = new Logger(QueueProcessor.name);

//   constructor(private readonly syncService: SyncService) {
//     super();
//   }

//   async process(job: Job<SyncJobData>): Promise<void> {
//     const data = job.data;

//     switch (data.type) {
//       case SyncJobType.INDEX_VARIANT:
//         await this.syncService.indexVariant(data.variantId);
//         break;

//       case SyncJobType.REMOVE_VARIANT:
//         await this.syncService.removeFromIndex(data.variantId);
//         break;

//       case SyncJobType.REINDEX_ALL:
//         await this.syncService.reindexAll();
//         break;

//       default:
//         this.logger.warn(`Unknown job type received`);
//     }
//   }

//   @OnWorkerEvent('completed')
//   onCompleted(job: Job) {
//     this.logger.log(`Job ${job.id} (${job.name}) completed`);
//   }

//   @OnWorkerEvent('failed')
//   onFailed(job: Job | undefined, err: Error) {
//     this.logger.error(`Job ${job?.id} (${job?.name}) failed: ${err.message}`);
//   }
// }





