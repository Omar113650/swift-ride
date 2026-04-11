







// import { Injectable } from '@nestjs/common';
// import { InjectQueue } from '@nestjs/bullmq';
// import { Queue } from 'bullmq';
// import { SYNC_QUEUE, SyncJobData, SyncJobType } from './queue.constants';

// @Injectable()
// export class QueueProducer {
//   constructor(
//     @InjectQueue(SYNC_QUEUE)
//     private readonly queue: Queue<SyncJobData>,
//   ) {}

//   async enqueueIndexVariant(variantId: string): Promise<void> {
//     await this.queue.add(
//       SyncJobType.INDEX_VARIANT,
//       { type: SyncJobType.INDEX_VARIANT, variantId },
//       { jobId: `index:${variantId}` },
//     );
//   }

//   async enqueueRemoveVariant(variantId: string): Promise<void> {
//     await this.queue.add(
//       SyncJobType.REMOVE_VARIANT,
//       { type: SyncJobType.REMOVE_VARIANT, variantId },
//     );
//   }

//   async enqueueReindexAll(): Promise<void> {
//     await this.queue.add(
//       SyncJobType.REINDEX_ALL,
//       { type: SyncJobType.REINDEX_ALL },
//       { jobId: 'reindex-all' },
//     );
//   }
// }







































