import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleDto } from './vehicles.dto';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {}
