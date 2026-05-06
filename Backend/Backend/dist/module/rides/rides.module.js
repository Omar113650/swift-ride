"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideModule = void 0;
const common_1 = require("@nestjs/common");
const rides_controller_1 = require("./rides.controller");
const rides_service_1 = require("./rides.service");
const geocoding_module_1 = require("./Geocoding/geocoding.module");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const auth_middleware_1 = require("../../core/middleware/auth/auth.middleware");
const users_module_1 = require("../users/users.module");
const drivers_module_1 = require("../drivers/drivers.module");
const chat_gateway_1 = require("../../core/socket/gateways/chat.gateway");
const socket_service_1 = require("../../core/socket/socket.service");
const ride_tracking_service_1 = require("./track-live location/ride-tracking.service");
const bullmq_1 = require("@nestjs/bullmq");
const ride_processor_1 = require("./BullMQ/ride.processor");
const ride_consumer_1 = require("../../common/logger/cache/ride.consumer");
const routing_service_1 = require("./routing Ride/routing.service");
const redis_service_1 = require("../../common/logger/cache/redis.service");
const dotenv = __importStar(require("dotenv"));
require("dotenv/config");
dotenv.config();
let RideModule = class RideModule {
    configure(consumer) {
        consumer.apply(auth_middleware_1.AuthMiddleware).forRoutes(rides_controller_1.RideController);
    }
};
exports.RideModule = RideModule;
exports.RideModule = RideModule = __decorate([
    (0, common_1.Module)({
        imports: [
            geocoding_module_1.GeocodingModule,
            users_module_1.UsersModule,
            drivers_module_1.DriversModule,
            bullmq_1.BullModule.forRoot({
                connection: {
                    host: process.env.HOST_REDIS,
                    username: process.env.USERNAME_REDIS,
                    password: process.env.PASSWORD_REDIS,
                    port: process.env.PORT_REDIS
                        ? parseInt(process.env.PORT_REDIS, 10)
                        : 19539,
                },
            }),
            bullmq_1.BullModule.registerQueue({
                name: 'ride',
                defaultJobOptions: {
                    attempts: 5,
                    backoff: {
                        type: 'exponential',
                        delay: 2000,
                    },
                    removeOnComplete: true,
                    removeOnFail: false,
                },
            }, {
                name: 'ride-dead-letter',
            }),
        ],
        controllers: [rides_controller_1.RideController],
        providers: [
            rides_service_1.RideService,
            prisma_service_1.PrismaService,
            socket_service_1.SocketService,
            chat_gateway_1.AppGateway,
            ride_tracking_service_1.RideTrackingService,
            ride_processor_1.RideProcessor,
            ride_consumer_1.RideConsumer,
            routing_service_1.RoutingService,
            redis_service_1.RedisService,
        ],
        exports: [rides_service_1.RideService, ride_tracking_service_1.RideTrackingService],
    })
], RideModule);
//# sourceMappingURL=rides.module.js.map