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
exports.RidesService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const polyline_1 = __importDefault(require("@mapbox/polyline"));
let RidesService = class RidesService {
    redis;
    prisma;
    constructor(redis, prisma) {
        this.redis = redis;
        this.prisma = prisma;
    }
    async getRideRoute(rideId) {
        const cacheKey = `ride:${rideId}:route`;
        const cached = await this.redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const ride = await this.prisma.ride.findUnique({
            where: { id: rideId },
        });
        if (!ride || !ride.route) {
            return [];
        }
        const points = polyline_1.default.decode(ride.route);
        await this.redis.set(cacheKey, JSON.stringify(points), {
            EX: 3600,
        });
        return points;
    }
};
exports.RidesService = RidesService;
exports.RidesService = RidesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('REDIS')),
    __metadata("design:paramtypes", [Object, Object])
], RidesService);
//# sourceMappingURL=getRideRoute_cache.js.map