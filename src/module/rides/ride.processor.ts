import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';

@Processor('ride')
@Injectable()
export class RideProcessor extends WorkerHost {
  async process(job: Job): Promise<any> {
    switch (job.name) {
      case 'ride-request': {
        const { userId, pickup, destination } = job.data;

        console.log('🚗 Processing ride request...');

        // 1. save ride in DB (Prisma)
        // 2. find nearest driver
        // 3. notify driver via socket

        return {
          status: 'processed',
        };
      }
    }
  }
}