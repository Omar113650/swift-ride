import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum DriverStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  ON_RIDE = 'ON_RIDE',
}

export class CreateDriverDto {
  @ApiProperty({ example: 'license-123456' })
  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty({ example: '12345678901234' })
  @IsString()
  @IsNotEmpty()
  nationalId: string;

  @ApiPropertyOptional({ enum: DriverStatus, default: DriverStatus.OFFLINE })
  @IsEnum(DriverStatus)
  @IsOptional()
  status?: DriverStatus = DriverStatus.OFFLINE;
}

// export class UpdateDriverLocationDto {
//   @ApiPropertyOptional({ example: 'license-123456' })
//   @IsString()
//   @IsOptional()
//   licenseNumber?: string;

//   @ApiPropertyOptional({ example: '12345678901234' })
//   @IsString()
//   @IsOptional()
//   nationalId?: string;

//   @ApiPropertyOptional({ enum: DriverStatus })
//   @IsEnum(DriverStatus)
//   @IsOptional()
//   status?: DriverStatus;
// }







