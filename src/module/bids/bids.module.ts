

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RideBidService } from './bids.service';
import { RideBidController } from './bids.controller';
import { AuthMiddleware } from '../../core/middleware/auth/auth.middleware';
import { UsersModule } from '../users/users.module';
import { DriversModule } from '../drivers/drivers.module';
import { RideModule } from '../rides/rides.module';
import { RolesGuard } from '../../core/guards/roles.guard';
import { PrismaService } from '../../core/prisma/prisma.service';

import { JwtModule } from '@nestjs/jwt';

@Module({

  
  imports: [UsersModule, DriversModule, RideModule, JwtModule.register({
    secret: 'JWT_ACCESS_SECRET',
  }),],
  controllers: [RideBidController],
  providers: [RideBidService, PrismaService, RolesGuard],
})

// export class BidsModule {}
export class BidsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(RideBidController);
  }
}




























