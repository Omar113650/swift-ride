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
var RideConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideConsumer = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../core/prisma/prisma.service");
const socket_service_1 = require("../../../core/socket/socket.service");
let RideConsumer = RideConsumer_1 = class RideConsumer extends bullmq_1.WorkerHost {
    prisma;
    socketService;
    deadLetterQueue;
    logger = new common_1.Logger(RideConsumer_1.name);
    constructor(prisma, socketService, deadLetterQueue) {
        super();
        this.prisma = prisma;
        this.socketService = socketService;
        this.deadLetterQueue = deadLetterQueue;
        console.log(' RideConsumer READY');
    }
    async handleRideCreated(data) {
        console.log('🚗 HANDLE RIDE:', data.rideId);
        const { pickup } = data;
        const drivers = await this.prisma.$queryRaw `
      SELECT 
        dl."driverId",
        (
          6371 * acos(
            cos(radians(${pickup.lat})) *
            cos(radians(dl."lat")) *
            cos(radians(dl."lng") - radians(${pickup.lng})) +
            sin(radians(${pickup.lat})) *
            sin(radians(dl."lat"))
          )
        ) AS distance
      FROM "driver_locations" dl
      ORDER BY distance
      LIMIT 10;
    `;
        console.log(' DRIVERS FOUND:', drivers.length);
        for (const driver of drivers) {
            console.log('📡 EMIT DRIVER:', driver.driverId);
            this.socketService.emitToDriver(driver.driverId, 'new_ride', {
                rideId: data.rideId,
                pickup: data.pickup,
                destination: data.destination,
                distance: data.distance,
                estimatedTimeMinutes: data.estimatedTimeMinutes,
                estimatedPrice: data.estimatedPrice,
            });
        }
        console.log(' DONE:', data.rideId);
        return { success: true };
    }
    async process(job) {
        console.log(' JOB RECEIVED:', {
            name: job.name,
            id: job.id,
            data: job.data,
        });
        try {
            switch (job.name) {
                case 'ride-created':
                    return await this.handleRideCreated(job.data);
                default:
                    console.log(' UNKNOWN JOB:', job.name);
                    throw new Error(`Unknown job: ${job.name}`);
            }
        }
        catch (error) {
            console.error(' JOB FAILED:', error.message);
            if (job.attemptsMade >= 4) {
                console.log('☠️ SENDING TO DEAD LETTER QUEUE');
                await this.deadLetterQueue.add('ride-dead-letter', {
                    originalJob: job.name,
                    data: job.data,
                    error: error.message,
                    failedAt: new Date(),
                });
            }
            throw error;
        }
    }
};
exports.RideConsumer = RideConsumer;
exports.RideConsumer = RideConsumer = RideConsumer_1 = __decorate([
    (0, bullmq_1.Processor)('ride'),
    (0, common_1.Injectable)(),
    __param(2, (0, bullmq_1.InjectQueue)('ride-dead-letter')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        socket_service_1.SocketService,
        bullmq_2.Queue])
], RideConsumer);
//# sourceMappingURL=ride.consumer.js.map