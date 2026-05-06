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
var RideTrackingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideTrackingService = void 0;
const common_1 = require("@nestjs/common");
let RideTrackingService = RideTrackingService_1 = class RideTrackingService {
    redis;
    logger = new common_1.Logger(RideTrackingService_1.name);
    constructor(redis) {
        this.redis = redis;
    }
    async updateDriverLocation(data) {
        const { driverId, rideId, lat, lng } = data;
        try {
            await this.redis.set(`driver:${driverId}:location`, JSON.stringify({ lat, lng, time: Date.now() }));
            await this.redis.geoAdd('drivers:available', {
                longitude: lng,
                latitude: lat,
                member: driverId,
            });
            await this.redis.rPush(`ride:${rideId}:coords`, JSON.stringify({ lat, lng }));
            await this.redis.lTrim(`ride:${rideId}:coords`, -500, -1);
            this.logger.log(` Location updated for driver ${driverId} | ride ${rideId}`);
            return { success: true };
        }
        catch (err) {
            this.logger.error(' updateDriverLocation failed', err);
            throw err;
        }
    }
    async getLastLocation(driverId) {
        const data = await this.redis.get(`driver:${driverId}:location`);
        return data ? JSON.parse(data) : null;
    }
};
exports.RideTrackingService = RideTrackingService;
exports.RideTrackingService = RideTrackingService = RideTrackingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS')),
    __metadata("design:paramtypes", [Object])
], RideTrackingService);
//# sourceMappingURL=ride-tracking.service.js.map