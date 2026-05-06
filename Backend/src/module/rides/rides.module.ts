import { Module, NestModule } from '@nestjs/common';
import { RideController } from './rides.controller';
import { RideService } from './rides.service';
import { GeocodingModule } from './Geocoding/geocoding.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AuthMiddleware } from '../../core/middleware/auth/auth.middleware';
import { UsersModule } from '../users/users.module';
import { DriversModule } from '../drivers/drivers.module';
import { AppGateway } from '../../core/socket/gateways/chat.gateway';
import { SocketService } from '../../core/socket/socket.service';
import { RideTrackingService } from './track-live location/ride-tracking.service';
import { BullModule } from '@nestjs/bullmq';
import { RideProcessor } from './BullMQ/ride.processor';
import { RideConsumer } from '../../common/logger/cache/ride.consumer';
import { RoutingService } from './routing Ride/routing.service';
import { RedisService } from '../../common/logger/cache/redis.service';

import * as dotenv from 'dotenv';

import 'dotenv/config';
dotenv.config();
@Module({
  imports: [
    GeocodingModule,
    UsersModule,
    DriversModule,

    // if queue send message  latter
    // BullModule.registerQueue({
    //   name: 'ride',
    //   connection: {
    //     host: 'redis-19539.c16.us-east-1-2.ec2.cloud.redislabs.com',
    //     port: 19539,
    //     username: 'default',
    //     password: 'JTH64LWaQ8Hr1bBsc9s8G1FJUbx61jXq',
    //   },

    //   defaultJobOptions: {
    //     attempts: 5,
    //     backoff: {
    //       type: 'exponential',
    //       delay: 2000,
    //     },
    //     removeOnComplete: true,
    //     removeOnFail: false,
    //   },
    // }),

    BullModule.forRoot({
      connection: {
        host: process.env.HOST_REDIS,

        username: process.env.USERNAME_REDIS,
        password: process.env.PASSWORD_REDIS,
        port: process.env.PORT_REDIS
          ? parseInt(process.env.PORT_REDIS, 10)
          : 19539,
      },
    }),

    BullModule.registerQueue(
      {
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
      },
      {
        name: 'ride-dead-letter',
      },
    ),
  ],

  controllers: [RideController],
  providers: [
    RideService,
    PrismaService,
    SocketService,
    AppGateway,
    RideTrackingService,
    RideProcessor,
    RideConsumer,
    RoutingService,
    RedisService,
    // RidesService
  ],
  exports: [RideService, RideTrackingService],
})
// export class RideModule {}
export class RideModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(RideController);
  }
}
