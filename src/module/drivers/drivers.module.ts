import {
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
} from '@nestjs/common';
import { DriverService } from './drivers.service';
import { DriverController } from './drivers.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { RolesGuard } from '../../core/guards/roles.guard';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AuthMiddleware } from '../../core/middleware/auth/auth.middleware';
import{GeocodingModule} from '../rides/geocoding.module'
@Module({
  imports: [UsersModule,GeocodingModule],
  controllers: [DriverController],
  providers: [DriverService, RolesGuard],
})

// export class DriversModule{}

export class DriversModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(DriverController);
  }
}
