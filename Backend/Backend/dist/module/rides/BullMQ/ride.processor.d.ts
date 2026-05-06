import { WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { SocketService } from '../../../core/socket/socket.service';
import { PrismaService } from '../../../core/prisma/prisma.service';
export declare class RideProcessor extends WorkerHost {
    private readonly queue;
    private readonly prisma;
    private readonly socketService;
    private readonly logger;
    constructor(queue: Queue, prisma: PrismaService, socketService: SocketService);
    process(job: Job): Promise<any>;
}
