import { Module, NestModule } from '@nestjs/common';
import { RideController } from './rides.controller';
import { RideService } from './rides.service';
import { GeocodingModule } from './geocoding.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { RolesGuard } from '../../core/guards/roles.guard';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AuthMiddleware } from '../../core/middleware/auth/auth.middleware';
import { UsersModule } from '../users/users.module';
import { DriversModule } from '../drivers/drivers.module';
import { MapsModule } from './maps/maps.module';
import { AppGateway } from '../../gateways/chat.gateway';
import { SocketService } from '../../core/socket/socket.service';
import { RideTrackingService } from './ride-tracking.service';
// import{RidesService} from '../../core/redis/cache'
// import{RedisCacheModule} from '../../core/redis/cache.module
import { BullModule } from '@nestjs/bullmq';
import{RideProcessor} from './ride.processor'
import { RedisModule } from '../../core/redis/redis.module';
import { RideConsumer } from '../../common/logger/cache/ride.consumer';
@Module({
  imports: [
    GeocodingModule,
    UsersModule,
    DriversModule,
    MapsModule,
    RedisModule,






// REDIS_HOST=redis-19539.c16.us-east-1-2.ec2.cloud.redislabs.com
// REDIS_PORT=19539
// REDIS_USER=default
// REDIS_PASS=JTH64LWaQ8Hr1bBsc9s8G1FJUbx61jXq


    // BullModule.registerQueue({
    //   name: 'ride',
    //   connection: {
    //     host: "redis-19539.c16.us-east-1-2.ec2.cloud.redislabs.com",
    //     port: 19539,
    //     username: "default",
    //     password:"JTH64LWaQ8Hr1bBsc9s8G1FJUbx61jXq",
    //   },
    // }),







// Retry mechanism
// ✔ Dead Letter Queue (failed handling)
// ✔ Proper BullMQ config
// ✔ Worker safe error handling
// ✔ Queue add options



BullModule.registerQueue({
  name: 'ride',
  connection: {
    host: 'redis-19539.c16.us-east-1-2.ec2.cloud.redislabs.com',
    port: 19539,
    username: 'default',
    password: 'JTH64LWaQ8Hr1bBsc9s8G1FJUbx61jXq',
  },

  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
}),

// 💀 لازم تضيف دي
BullModule.registerQueue({
  name: 'ride-dead-letter',
  connection: {
    host: 'redis-19539.c16.us-east-1-2.ec2.cloud.redislabs.com',
    port: 19539,
    username: 'default',
    password: 'JTH64LWaQ8Hr1bBsc9s8G1FJUbx61jXq',
  },
}),
















  ],
  controllers: [RideController],
  providers: [
    RideService,
    PrismaService,
    SocketService,
    AppGateway,
    RideTrackingService,
    RideProcessor,
    RideConsumer
  ],
  exports: [RideService],
})
// export class RideModule {}
export class RideModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(RideController);
  }
}















// 👉 ده معناه:

// ✔ RideService بقى Producer
// ✔ RideConsumer شغال Worker
// ✔ Queue شغالة
// ✔ Job بيتنفذ
// ✔ Socket بيبعت