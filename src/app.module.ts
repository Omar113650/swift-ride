import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './core/prisma/prisma.module';
import { UsersModule } from './module/users/users.module';
// import { LoggerModule } from './common/logger/logger.module';
import { VehicleModule } from './module/Vehicle/vehicle.module';
import { DriversModule } from './module/drivers/drivers.module';
import { RideModule } from './module/rides/rides.module';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { LoggingInterceptor } from './common/logger/logging.interceptor';
// import { MiddlewareConsumer, NestModule } from '@nestjs/common';
// import { CorrelationIdMiddleware } from './common/logger/correlation-id.middleware';
import { MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from './core/middleware/auth/auth.middleware';
import { BidsModule } from './module/bids/bids.module';
import{RedisModule} from './core/redis/redis.module'
import { ScheduleModule } from '@nestjs/schedule';
// import{CronService} from './core/cron/cron.service'
import{AppGateway} from './gateways/chat.gateway'

@Module({
  imports: [
    ScheduleModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV !== 'PRODUCTION' ? '.env' : '.env.production',
      // load: [databaseConfig, jwtConfig],

       
        
    }),

    PrismaModule,
    UsersModule,
    // LoggerModule,
    VehicleModule,
    DriversModule,
    RideModule,
  
    BidsModule,
    RedisModule
    // AuthMiddleware
  ],

  controllers: [AppController],
  providers: [
    AppService,
    // CronService
    AppGateway
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
  ],
})
export class AppModule {}

















// ===============================================================module to senior developer ====================================

// import { Module, OnModuleInit, Logger } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { BullModule } from '@nestjs/bullmq';
// import { BullBoardModule } from '@bull-board/nestjs';
// import { ExpressAdapter } from '@bull-board/express';
// import { DatabaseModule } from './database/database.module';
// import { AppElasticsearchModule } from './elasticsearch/elasticsearch.module';
// import { QueueModule } from './queue/queue.module';
// import { SyncModule } from './sync/sync.module';
// import { ProductsModule } from './products/products.module';
// import { SearchModule } from './search/search.module';
// import { SyncService } from './sync/sync.service';
// import { QueueProducer } from './queue/queue.producer';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }),
//     BullModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: (config: ConfigService) => ({
//         connection: {
//           host: config.get('REDIS_HOST', 'localhost'),
//           port: config.get<number>('REDIS_PORT', 6379),
//         },
//       }),
//       inject: [ConfigService],
//     }),
//     BullBoardModule.forRoot({
//       route: '/queues',
//       adapter: ExpressAdapter,
//     }),
//     DatabaseModule,
//     AppElasticsearchModule,
//     QueueModule,
//     SyncModule,
//     ProductsModule,
//     SearchModule,
//   ],
// })
// export class AppModule implements OnModuleInit {
//   private readonly logger = new Logger(AppModule.name);

//   constructor(
//     private readonly syncService: SyncService,
//     private readonly queueProducer: QueueProducer,
//   ) {}

//   async onModuleInit() {
//     try {
//       await this.syncService.ensureIndex();
//       await this.queueProducer.enqueueReindexAll();
//     } catch (err) {
//       this.logger.error('Failed to ensure ES index', err);
//     }
//   }
// }
