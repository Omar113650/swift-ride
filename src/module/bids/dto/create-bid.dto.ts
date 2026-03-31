import { IsUUID, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRideBidDto {
  @ApiProperty({ example: 'ride-uuid' })
  @IsUUID()
  rideId: string;

  // ❌ هنشيله من الـ body
  // driverId هيجي من auth (req.user.id)

  @ApiProperty({ example: 70 })
  @Type(() => Number)
  @IsNumber()
  @Min(1) // أقل سعر
  price: number;

  @ApiProperty({ example: 5, description: 'ETA in minutes' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(60) // max ساعة
  arrivalTime: number;
}
