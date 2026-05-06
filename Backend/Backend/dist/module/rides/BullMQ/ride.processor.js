"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RideProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const common_1 = require("@nestjs/common");
const socket_service_1 = require("../../../core/socket/socket.service");
const prisma_service_1 = require("../../../core/prisma/prisma.service");
const bullmq_3 = require("@nestjs/bullmq");
let RideProcessor = RideProcessor_1 = class RideProcessor extends bullmq_1.WorkerHost {
    queue;
    prisma;
    socketService;
    logger = new common_1.Logger(RideProcessor_1.name);
    constructor(queue, prisma, socketService) {
        super();
        this.queue = queue;
        this.prisma = prisma;
        this.socketService = socketService;
    }
    async process(job) {
        try {
            this.logger.log(` Processing job: ${job.name}`);
            switch (job.name) {
                case 'ride-created': {
                    const { rideId, riderId, pickup, destination, distance, estimatedTimeMinutes, estimatedPrice, } = job.data;
                    this.logger.log(` Handling ride-created: ${rideId}`);
                    await this.queue.add('notify-drivers', {
                        rideId,
                        pickup,
                    });
                    this.logger.log({
                        event: 'ride_created',
                        rideId,
                        distance,
                        estimatedTimeMinutes,
                        estimatedPrice,
                    });
                    return {
                        status: 'processed',
                        rideId,
                    };
                }
                case 'notify-drivers': {
                    const { rideId, pickup } = job.data;
                    this.logger.log(`📡 Notifying drivers for ride ${rideId}`);
                    return { notified: true };
                }
                case 'process-payment': {
                    const { rideId, amount, method } = job.data;
                    this.logger.log(`💰 Processing payment for ride ${rideId}`);
                    return { paid: true };
                }
                case 'send-notification': {
                    const { userId, title, message } = job.data;
                    this.logger.log(` Sending notification to ${userId}`);
                    return { sent: true };
                }
                default:
                    this.logger.warn(`Unknown job: ${job.name}`);
                    return {
                        status: 'ignored',
                        job: job.name,
                    };
            }
        }
        catch (error) {
            this.logger.error(` Job failed`, {
                job: job.name,
                data: job.data,
                error: error.message,
                stack: error.stack,
            });
            throw error;
        }
    }
};
exports.RideProcessor = RideProcessor;
exports.RideProcessor = RideProcessor = RideProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('ride'),
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_3.InjectQueue)('ride')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        prisma_service_1.PrismaService,
        socket_service_1.SocketService])
], RideProcessor);
//# sourceMappingURL=ride.processor.js.map