import { IsUUID, IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum RideStatus {
  PENDING = 'PENDING',
  BIDDING = 'BIDDING',
  DRIVER_SELECTED = 'DRIVER_SELECTED',
  DRIVER_ARRIVING = 'DRIVER_ARRIVING',
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// 🚀 Rider Request DTO
export class CreateRideDto {
  @ApiProperty({ example: 31.04 })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  pickupLat: number;

  @ApiProperty({ example: 30.04 })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  pickupLng: number;

  @ApiProperty({ example: 31.05 })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  destinationLat: number;

  @ApiProperty({ example: 30.05 })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  destinationLng: number;

  // ❌ مش client responsibility
  // status, selectedPrice, distance => handled internally
}

// 🛠️ Update Ride DTO (Driver/Dispatch/Admin)
export class UpdateRideDto {
  @IsOptional()
  @IsEnum(RideStatus)
  status?: RideStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  selectedPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  distance?: number;

  // driverId مش client responsibility
}