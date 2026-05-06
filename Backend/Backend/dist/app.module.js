"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./core/prisma/prisma.module");
const users_module_1 = require("./module/users/users.module");
const logger_module_1 = require("./common/logger/logger.module");
const vehicle_module_1 = require("./module/Vehicle/vehicle.module");
const drivers_module_1 = require("./module/drivers/drivers.module");
const rides_module_1 = require("./module/rides/rides.module");
const core_1 = require("@nestjs/core");
const logging_interceptor_1 = require("./common/logger/logging.interceptor");
const correlation_id_middleware_1 = require("./common/logger/correlation-id.middleware");
const bids_module_1 = require("./module/bids/bids.module");
const redis_module_1 = require("./core/redis/redis.module");
const schedule_1 = require("@nestjs/schedule");
const cron_service_1 = require("./core/cron/cron.service");
const chat_gateway_1 = require("./core/socket/gateways/chat.gateway");
const socket_module_1 = require("./core/socket/socket.module");
const health_module_1 = require("./module/health/health.module");
const rating_module_1 = require("./module/Rating/rating.module");
const throttler_1 = require("@nestjs/throttler");
const jwt_config_1 = __importDefault(require("./config/jwt.config"));
const DB_config_1 = __importDefault(require("./config/DB.config"));
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(correlation_id_middleware_1.CorrelationIdMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [DB_config_1.default, jwt_config_1.default],
            }),
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 10,
                    },
                ],
            }),
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            logger_module_1.LoggerModule,
            vehicle_module_1.VehicleModule,
            drivers_module_1.DriversModule,
            rides_module_1.RideModule,
            bids_module_1.BidsModule,
            redis_module_1.RedisModule,
            socket_module_1.SocketModule,
            rating_module_1.RatingModule,
            health_module_1.HealthModule,
        ],
        controllers: [],
        providers: [
            cron_service_1.CronService,
            chat_gateway_1.AppGateway,
            cron_service_1.CronService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map