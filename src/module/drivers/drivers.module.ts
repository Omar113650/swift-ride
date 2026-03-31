import {
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
} from '@nestjs/common';
import { DriverService } from './drivers.service';
import { DriverController } from './drivers.controller';
import { AuthMiddleware } from 'src/core/middleware/auth/auth.middleware';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [DriverController],
  providers: [DriverService, RolesGuard],
})

// export class DriversModule{}

export class DriversModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(DriverController);
  }
}
