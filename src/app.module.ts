import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './core/prisma/prisma.module';
import { UsersModule } from './module/users/users.module';
import { LoggerModule } from './common/logger/logger.module';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { LoggingInterceptor } from './common/logger/logging.interceptor';
// import { MiddlewareConsumer, NestModule } from '@nestjs/common';
// import { CorrelationIdMiddleware } from './common/logger/correlation-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV !== 'PRODUCTION' ? '.env' : '.env.production',
      // load: [databaseConfig, jwtConfig],
    }),

    PrismaModule,
    UsersModule,
    LoggerModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
  ],
})
export class AppModule {}



// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(CorrelationIdMiddleware).forRoutes('*');
//   }
// }
=======
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
>>>>>>> 9e2e0c490e798f245057b871520a2347323cb7b2
