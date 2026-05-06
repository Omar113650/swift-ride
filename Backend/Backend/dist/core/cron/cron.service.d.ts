import { PrismaService } from '../prisma/prisma.service';
import { SocketService } from '../socket/socket.service';
export declare class CronService {
    private prisma;
    private socketService;
    private readonly logger;
    constructor(prisma: PrismaService, socketService: SocketService);
    س: any;
    sendMarketingAds(): Promise<void>;
    private getRandomAdMessage;
}
