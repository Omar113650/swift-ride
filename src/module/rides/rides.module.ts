import { Module, NestModule } from '@nestjs/common';
import { RideController } from './rides.controller';
import { RideService } from './rides.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { GeocodingModule } from './geocoding.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from 'src/core/middleware/auth/auth.middleware';
import { UsersModule } from '../users/users.module';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [GeocodingModule, UsersModule,DriversModule],
  controllers: [RideController],
  providers: [RideService, PrismaService],
})
// export class RideModule {}
export class RideModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(RideController);
  }
}
