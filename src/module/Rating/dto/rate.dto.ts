import {
  IsUUID,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export enum RaterType {
  USER = 'USER',
  DRIVER = 'DRIVER',
}
export class CreateRatingDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  driverId?: string;

  @IsEnum(RaterType)
  raterType: RaterType;

  @IsNumber()
  @Min(1)
  @Max(5)
  score: number;

  @IsOptional()
  @IsString()
  @Length(3, 500)
  comment?: string;
}