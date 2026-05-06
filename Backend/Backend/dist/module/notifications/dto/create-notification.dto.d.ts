import { NotificationType } from '../entities/notification.entity';
export declare class CreateNotificationDto {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    data?: any;
}
export declare class MarkNotificationAsReadDto {
    notificationId: string;
}
