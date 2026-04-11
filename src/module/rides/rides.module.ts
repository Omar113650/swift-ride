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

@Module({
  imports: [GeocodingModule, UsersModule,DriversModule,MapsModule],
  controllers: [RideController],
  providers: [RideService, PrismaService],
})
// export class RideModule {}
export class RideModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(RideController);
  }
}
