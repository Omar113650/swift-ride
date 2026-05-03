import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum RideStatus {
  PENDING = 'PENDING',
  BIDDING = 'BIDDING',
  DRIVER_SELECTED = 'DRIVER_SELECTED',
  DRIVER_ARRIVING = 'DRIVER_ARRIVING',
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateRideDto {

  @IsUUID()
  @IsOptional()
  rideId: string

  @ApiProperty({ example: 'Mansoura, Egypt' })
  @IsString()
  pickupAddress: string;

  @ApiProperty({ example: 'Cairo, Egypt' })
  @IsString()
  destinationAddress: string;

  @ApiProperty({ example: 'منطقة مزدحمة بالمرور', required: false })
  @IsOptional()
  @IsString()
  note?: string;


  
  @ApiProperty({ example: 'Ride Is COMPLETED ' })
  @IsString()
  @IsOptional()
  status: RideStatus;

  // rideType?: 'standard' | 'premium' | 'economy';
}
