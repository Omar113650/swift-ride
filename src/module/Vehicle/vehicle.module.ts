import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { CloudinaryService } from '../../core/cloudinary/cloudinary.service';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService, CloudinaryService],
})
export class VehicleModule {}
