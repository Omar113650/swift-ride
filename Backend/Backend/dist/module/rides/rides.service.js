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
var RideService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const Geocoding_service_1 = require("./Geocoding/Geocoding.service");
const socket_service_1 = require("../../core/socket/socket.service");
const pricing_factory_1 = require("./pricing/pricing.factory");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const routing_service_1 = require("./routing Ride/routing.service");
let RideService = RideService_1 = class RideService {
    prisma;
    geo;
    socketService;
    rideQueue;
    routingService;
    deadLetterQueue;
    logger = new common_1.Logger(RideService_1.name);
    constructor(prisma, geo, socketService, rideQueue, routingService, deadLetterQueue) {
        this.prisma = prisma;
        this.geo = geo;
        this.socketService = socketService;
        this.rideQueue = rideQueue;
        this.routingService = routingService;
        this.deadLetterQueue = deadLetterQueue;
    }
    async createRide(riderId, dto, calculatePrice = true) {
        this.logger.log(`🚗 Creating ride for rider: ${riderId}`);
        if (dto.rideId) {
            const existing = await this.prisma.ride.findUnique({
                where: { id: dto.rideId },
            });
            if (existing)
                return { ride: existing, message: 'Already exists ' };
        }
        const pickup = await this.geo.getCoordinates(dto.pickupAddress);
        const destination = await this.geo.getCoordinates(dto.destinationAddress);
        const route = await this.routingService.getRoute({ lat: pickup.lat, lng: pickup.lng }, { lat: destination.lat, lng: destination.lng });
        const distance = route.distance;
        const time = Math.ceil(route.duration);
        const polyline = route.polyline;
        const price = calculatePrice
            ? pricing_factory_1.PricingFactory.create(distance > 100 ? 'intercity' : 'standard').calculate(distance, time)
            : null;
        const ride = await this.prisma.ride.create({
            data: {
                id: dto.rideId,
                pickupLat: pickup.lat,
                pickupLng: pickup.lng,
                destinationLat: destination.lat,
                destinationLng: destination.lng,
                pickupAddress: dto.pickupAddress,
                destinationAddress: dto.destinationAddress,
                distance,
                polyline,
                selectedPrice: price,
                status: 'BIDDING',
                rider: { connect: { id: riderId } },
            },
        });
        await this.rideQueue.add('ride-created', {
            rideId: ride.id,
            riderId,
            pickup,
            destination,
            distance,
            estimatedTimeMinutes: time,
            estimatedPrice: price,
            polyline,
        });
        this.socketService.emitToAllDrivers('new_ride', {
            rideId: ride.id,
            pickup: dto.pickupAddress,
            destination: dto.destinationAddress,
            estimatedPrice: price,
            estimatedTimeMinutes: time,
        });
        return {
            ride,
            estimatedTimeMinutes: time,
            estimatedPrice: price,
            polyline,
            message: 'Ride created ',
        };
    }
    async assignDriver(rideId, driverId) {
        const ride = await this.prisma.ride.findUnique({
            where: { id: rideId },
        });
        if (!ride) {
            throw new common_1.NotFoundException('Ride not found');
        }
        const driver = await this.prisma.driver.findUnique({
            where: { id: driverId },
        });
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        if (driver.status === 'OFFLINE') {
            throw new common_1.BadRequestException('Driver is offline');
        }
        if (ride.driverId) {
            throw new common_1.BadRequestException('Ride already has a driver');
        }
        return await this.prisma.ride.update({
            where: { id: rideId },
            data: {
                driverId: driver.id,
                status: 'DRIVER_SELECTED',
            },
        });
    }
    async startRide(rideId) {
        return this.prisma.ride.update({
            where: { id: rideId },
            data: {
                status: 'STARTED',
                startedAt: new Date(),
            },
        });
    }
    async completeRide(rideId, distance) {
        return this.prisma.ride.update({
            where: { id: rideId },
            data: {
                status: 'COMPLETED',
                completedAt: new Date(),
                distance,
            },
        });
    }
    async cancelRide(rideId, cancelledBy) {
        return this.prisma.ride.update({
            where: { id: rideId },
            data: {
                status: 'CANCELLED',
                cancelledBy,
            },
        });
    }
    async addRouteHistory(rideId, lat, lng) {
        return this.prisma.rideRoute.create({
            data: {
                rideId,
                lat,
                lng,
                timestamp: new Date(),
            },
        });
    }
    async getRide(rideId) {
        return this.prisma.ride.findUnique({
            where: { id: rideId },
            include: {
                rider: true,
                driver: true,
                routeHistory: true,
                payment: true,
            },
        });
    }
    async approveBid(rideId, driverId) {
        const bid = await this.prisma.rideBid.update({
            where: {
                rideId_driverId: {
                    rideId,
                    driverId,
                },
            },
            data: {},
        });
        return bid;
    }
    async getRidesStatsByStatus() {
        return this.prisma.ride.groupBy({
            by: ['status'],
            _count: {
                _all: true,
            },
        });
    }
    async getTotalRides() {
        return this.prisma.ride.count();
    }
    async updateRideStatus(dto) {
        const ride = await this.prisma.ride.findUnique({
            where: { id: dto.rideId },
        });
        if (!ride) {
            throw new Error('Ride not found');
        }
        const updatedRide = await this.prisma.ride.update({
            where: { id: dto.rideId },
            data: {
                status: dto.status,
            },
        });
        return updatedRide;
    }
    async getTopRiders() {
        const riders = await this.prisma.user.findMany({
            where: {
                role: 'RIDER',
            },
            include: {
                _count: {
                    select: {
                        rides: true,
                    },
                },
            },
            orderBy: {
                rides: {
                    _count: 'desc',
                },
            },
        });
        return riders;
    }
};
exports.RideService = RideService;
exports.RideService = RideService = RideService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, bullmq_1.InjectQueue)('ride')),
    __param(5, (0, bullmq_1.InjectQueue)('ride-dead-letter')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        Geocoding_service_1.GeocodingService,
        socket_service_1.SocketService,
        bullmq_2.Queue,
        routing_service_1.RoutingService,
        bullmq_2.Queue])
], RideService);
//# sourceMappingURL=rides.service.js.map