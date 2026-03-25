import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// Create Vehicle DTO
export class CreateVehicleDto {
  @ApiProperty({ example: 'Car' })
  @IsString()
  type: string;

  @ApiProperty({ example: 'Toyota Corolla' })
  @IsString()
  model: string;
  
  @ApiProperty({ example: 'coca-cola.png', required: true })
  @IsString()
  image:string

  @ApiProperty({ example: 'Red' })
  @IsString()
  color: string;

  @ApiProperty({ example: 'ABC1234' })
  @IsString()
  plateNumber: string;

  @ApiProperty({ example: 2022 })
  @Type(() => Number)
  @IsNumber()
  @Min(1900)
  @Max(2100)
  year: number;
}
