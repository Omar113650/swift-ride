import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDriverLocationDto {
  @ApiProperty({ example: 31.0407 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 31.3581 })
  @IsNumber()
  lng: number;

  @ApiProperty({ required: false, example: 5 })
  @IsOptional()
  @IsNumber()
  accuracy?: number;

  @ApiProperty({ required: false, example: 40 })
  @IsOptional()
  @IsNumber()
  speed?: number;

  @ApiProperty({ required: false, example: 180 })
  @IsOptional()
  @IsNumber()
  heading?: number;
}