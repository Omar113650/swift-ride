











































































// mport { Global, Module } from '@nestjs/common';
// import { BullModule } from '@nestjs/bullmq';
// import { BullBoardModule } from '@bull-board/nestjs';
// import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
// import { SYNC_QUEUE } from './queue.constants';
// import { QueueProducer } from './queue.producer';
// import { QueueProcessor } from './queue.processor';

// @Global()
// @Module({
//   imports: [
//     BullModule.registerQueue({
//       name: SYNC_QUEUE,
//       defaultJobOptions: {
//         attempts: 5,
//         backoff: {
//           type: 'exponential',
//           delay: 1000,
//         },
//         removeOnComplete: 100,
//         removeOnFail: 500,
//       },
//     }),
//     BullBoardModule.forFeature({
//       name: SYNC_QUEUE,
//       adapter: BullMQAdapter,
//     }),
//   ],
//   providers: [QueueProducer, QueueProcessor],
//   exports: [QueueProducer, BullModule],
// })
// export class QueueModule {}

