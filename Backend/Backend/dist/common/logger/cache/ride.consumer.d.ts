import { WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { SocketService } from '../../../core/socket/socket.service';
export declare class RideConsumer extends WorkerHost {
    private prisma;
    private socketService;
    private readonly deadLetterQueue;
    private readonly logger;
    constructor(prisma: PrismaService, socketService: SocketService, deadLetterQueue: Queue);
    handleRideCreated(data: any): Promise<{
        success: boolean;
    }>;
    process(job: Job): Promise<any>;
}
