import { IsString, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'Driver is arriving' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Your driver will arrive in 5 minutes' })
  @IsString()
  message: string;

  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({ example: { rideId: '123' }, required: false })
  @IsOptional()
  data?: any;
}






export class MarkNotificationAsReadDto {
  @IsUUID()
  notificationId: string;
}