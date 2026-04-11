import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { CloudinaryService } from '../../core/cloudinary/cloudinary.service';
import { RolesGuard } from '../../core/guards/roles.guard';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AuthMiddleware } from '../../core/middleware/auth/auth.middleware';
import { UsersModule } from '../users/users.module';
import { DriversModule } from '../drivers/drivers.module';
import { CloudinaryModule } from '../../core/cloudinary/cloudinary.module';
// CloudinaryModule  لازم احطها ف اي موديل استخدم فيه الصور
@Module({
  imports: [UsersModule, DriversModule, CloudinaryModule],
  controllers: [VehicleController],
  providers: [VehicleService, CloudinaryService, RolesGuard],
})
export class VehicleModule {}
// export class VehicleModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(AuthMiddleware).forRoutes(VehicleController);
//   }
// }
