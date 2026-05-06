import { Module, NestModule } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { PrismaModule } from './core/prisma/prisma.module';
import { UsersModule } from './module/users/users.module';
import { LoggerModule } from './common/logger/logger.module';
import { VehicleModule } from './module/Vehicle/vehicle.module';
import { DriversModule } from './module/drivers/drivers.module';
import { RideModule } from './module/rides/rides.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/logger/logging.interceptor';
import { CorrelationIdMiddleware } from './common/logger/correlation-id.middleware';
import { MiddlewareConsumer } from '@nestjs/common';
import { BidsModule } from './module/bids/bids.module';
import { RedisModule } from './core/redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './core/cron/cron.service';
import { AppGateway } from './core/socket/gateways/chat.gateway';
import { SocketModule } from './core/socket/socket.module';
import { HealthModule } from './module/health/health.module';
import { RatingModule } from './module/Rating/rating.module';
import { ThrottlerModule } from '@nestjs/throttler';
import jwtConfig from './config/jwt.config';
import databaseConfig from './config/DB.config';

@Module({
  imports: [
    ScheduleModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath:
      //   process.env.NODE_ENV !== 'PRODUCTION' ? '.env' : '.env.production',
      load: [databaseConfig, jwtConfig],
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),

    PrismaModule,
    UsersModule,
    LoggerModule,
    VehicleModule,
    DriversModule,
    RideModule,
    BidsModule,
    RedisModule,
    SocketModule,
    RatingModule,
    HealthModule,
  ],

  controllers: [],
  providers: [
    CronService,
    AppGateway,
    CronService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
