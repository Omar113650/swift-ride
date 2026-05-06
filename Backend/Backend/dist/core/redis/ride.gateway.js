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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const polyline_1 = __importDefault(require("@mapbox/polyline"));
let RideService = class RideService {
    prisma;
    redis;
    server;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async handleDriverLocation(data) {
        const { driverId, rideId, lat, lng } = data;
        await this.redis.set(`driver:${driverId}:location`, JSON.stringify({ lat, lng, time: Date.now() }));
        await this.redis.geoAdd('drivers:available', {
            longitude: lng,
            latitude: lat,
            member: driverId,
        });
        await this.redis.rPush(`ride:${rideId}:coords`, JSON.stringify({ lat, lng }));
        this.server.to(`ride:${rideId}`).emit('driver-location', {
            driverId,
            lat,
            lng,
        });
    }
    handleJoinRide(data, socket) {
        socket.join(`ride:${data.rideId}`);
    }
    async getLastLocation(data) {
        const location = await this.redis.get(`driver:${data.driverId}:location`);
        return location ? JSON.parse(location) : null;
    }
    async finishRide(rideId) {
        const coords = await this.redis.lRange(`ride:${rideId}:coords`, 0, -1);
        const points = coords.map((c) => {
            const p = JSON.parse(c);
            return [p.lat, p.lng];
        });
        const encodedRoute = polyline_1.default.encode(points);
        await this.prisma.ride.update({
            where: { id: rideId },
            data: { route: encodedRoute },
        });
        await this.redis.del(`ride:${rideId}:coords`);
        return { route: encodedRoute };
    }
    async getRideRoute(rideId) {
        const cacheKey = `ride:${rideId}:route`;
        const cached = await this.redis.get(cacheKey);
        if (cached)
            return JSON.parse(cached);
        const ride = await this.prisma.ride.findUnique({
            where: { id: rideId },
        });
        if (!ride?.route)
            return [];
        const points = polyline_1.default.decode(ride.route);
        await this.redis.set(cacheKey, JSON.stringify(points), {
            EX: 3600,
        });
        return points;
    }
};
exports.RideService = RideService;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RideService.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('driver-location'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RideService.prototype, "handleDriverLocation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-ride'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RideService.prototype, "handleJoinRide", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('get-last-location'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RideService.prototype, "getLastLocation", null);
exports.RideService = RideService = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('REDIS')),
    __metadata("design:paramtypes", [Object, Object])
], RideService);
//# sourceMappingURL=ride.gateway.js.map