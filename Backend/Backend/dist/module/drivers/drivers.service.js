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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const client_1 = require("@prisma/client");
const Geocoding_service_1 = require("../rides/Geocoding/Geocoding.service");
const elasticsearch_1 = require("@elastic/elasticsearch");
const redis_service_1 = require("../../common/logger/cache/redis.service");
const custom_logger_service_1 = require("../../common/logger/custom-logger.service");
const config_1 = require("@nestjs/config");
const api_features_1 = require("../../shared/utils/api-features");
let DriverService = class DriverService {
    prisma;
    geo;
    redis;
    redisService;
    logger;
    config;
    elastic;
    constructor(prisma, geo, redis, redisService, logger, config) {
        this.prisma = prisma;
        this.geo = geo;
        this.redis = redis;
        this.redisService = redisService;
        this.logger = logger;
        this.config = config;
        this.elastic = new elasticsearch_1.Client({
            node: 'https://my-elasticsearch-project-f1ecdc.es.us-central1.gcp.elastic.cloud:443',
            auth: {
                apiKey: 'MHJOdGlKMEJNRHdVeml0RmxaZDU6SVlkNFFvS0RJeUZJcENvbmFVdzRHZw==',
            },
        });
    }
    async indexDriver(driver) {
        await this.elastic.index({
            index: 'drivers',
            id: driver.id,
            document: {
                id: driver.id,
                userId: driver.userId,
                licenseNumber: driver.licenseNumber,
                nationalId: driver.nationalId,
                status: driver.status,
                isOnline: driver.status === 'ONLINE',
                updatedAt: new Date(),
            },
        });
    }
    async createDriver(userId, dto) {
        const existingDriver = await this.prisma.driver.findUnique({
            where: { userId },
        });
        if (existingDriver) {
            throw new common_1.BadRequestException('Driver already exists');
        }
        const driver = await this.prisma.driver.create({
            data: {
                userId,
                licenseNumber: dto.licenseNumber,
                nationalId: dto.nationalId,
                status: dto.status || client_1.DriverStatus.OFFLINE,
            },
        });
        await this.indexDriver(driver);
        return driver;
    }
    async getDrivers(req, query) {
        const cacheKey = `drivers:${JSON.stringify(query)}`;
        try {
            this.logger.log({
                message: 'Fetching drivers',
                correlationId: req.correlationId,
                context: 'DriverService',
            });
            const cachedDrivers = await this.redisService.getCache(cacheKey);
            if (cachedDrivers) {
                return {
                    source: 'cache',
                    data: cachedDrivers,
                };
            }
            const result = await new api_features_1.PrismaApiFeatures(query)
                .filter()
                .sort()
                .paginate()
                .execute(this.prisma.driver);
            if (!result.data.length) {
                throw new common_1.NotFoundException('No drivers found');
            }
            await this.redisService.setCache(cacheKey, result, 300);
            return {
                source: 'db',
                ...result,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async updateDriver(driverId, dto) {
        const driver = await this.prisma.driver.findUnique({
            where: { id: driverId },
        });
        if (!driver)
            throw new common_1.NotFoundException('Driver not found');
        const updated = await this.prisma.driver.update({
            where: { id: driverId },
            data: dto,
        });
        await this.indexDriver(updated);
        return updated;
    }
    async updateStatus(driverId, status) {
        const driver = await this.prisma.driver.findUnique({
            where: { id: driverId },
        });
        if (!driver)
            throw new common_1.NotFoundException('Driver not found');
        const updated = await this.prisma.driver.update({
            where: { id: driverId },
            data: { status },
        });
        await this.indexDriver(updated);
        return updated;
    }
    async updateLocationByAddress(driverId, address) {
        const coords = await this.geo.getCoordinates(address);
        return this.prisma.driverLocation.upsert({
            where: { driverId },
            update: {
                lat: coords.lat,
                lng: coords.lng,
                lastSeen: new Date(),
                status: 'ONLINE',
            },
            create: {
                driverId,
                lat: coords.lat,
                lng: coords.lng,
                lastSeen: new Date(),
                status: 'ONLINE',
            },
        });
    }
    async getDriverRides(driverId) {
        return this.prisma.ride.findMany({
            where: { driverId },
            include: { rideBids: true, rider: true },
        });
    }
    async getWallet(driverId) {
        const wallet = await this.prisma.driverWallet.findUnique({
            where: { driverId },
        });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        return wallet;
    }
    async updateWalletBalance(driverId, amount) {
        return this.prisma.driverWallet.update({
            where: { driverId },
            data: { balance: { increment: amount } },
        });
    }
    async findNearbyDrivers(lat, lng) {
        return this.redis.geoSearch('drivers:available', {
            longitude: lng,
            latitude: lat,
        }, {
            radius: 5,
            unit: 'km',
            SORT: 'ASC',
        });
    }
    async searchDrivers(query) {
        const result = await this.elastic.search({
            index: 'drivers',
            query: {
                bool: {
                    must: [
                        {
                            multi_match: {
                                query,
                                fields: ['licenseNumber', 'nationalId', 'userId'],
                                fuzziness: 'AUTO',
                            },
                        },
                    ],
                    filter: [
                        {
                            term: {
                                isOnline: true,
                            },
                        },
                    ],
                },
            },
        });
        return result.hits.hits.map((hit) => hit._source);
    }
    async findBestDrivers(lat, lng) {
        const nearby = await this.redis.geoSearch('drivers:available', { longitude: lng, latitude: lat }, { radius: 5, unit: 'km' });
        const result = await this.elastic.search({
            index: 'drivers',
            query: {
                bool: {
                    filter: [
                        {
                            terms: {
                                id: nearby,
                            },
                        },
                        {
                            term: {
                                isOnline: true,
                            },
                        },
                    ],
                },
            },
        });
        return result.hits.hits.map((hit) => hit._source);
    }
};
exports.DriverService = DriverService;
exports.DriverService = DriverService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)('REDIS')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        Geocoding_service_1.GeocodingService, Object, redis_service_1.RedisService,
        custom_logger_service_1.CustomLoggerService,
        config_1.ConfigService])
], DriverService);
//# sourceMappingURL=drivers.service.js.map