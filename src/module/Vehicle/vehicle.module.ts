import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { CloudinaryService } from '../../core/cloudinary/cloudinary.service';
import { AuthMiddleware } from 'src/core/middleware/auth/auth.middleware';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { UsersModule } from '../users/users.module';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports:[UsersModule,DriversModule],
  controllers: [VehicleController],
  providers: [VehicleService, CloudinaryService, RolesGuard],
})
export class VehicleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(VehicleController);
  }
}
