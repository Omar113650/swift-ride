export enum NotificationType {
  RIDE_REQUEST = 'RIDE_REQUEST',
  NEW_BID = 'NEW_BID',
  DRIVER_SELECTED = 'DRIVER_SELECTED',
  DRIVER_ARRIVING = 'DRIVER_ARRIVING',
  RIDE_STARTED = 'RIDE_STARTED',
  RIDE_COMPLETED = 'RIDE_COMPLETED',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export class Notification {
  id: string;

  userId: string; // مين هيستقبل

  title: string;
  message: string;

  type: NotificationType;

  isRead: boolean;

  data?: any; // extra (rideId, driverId...)

  createdAt: Date;
}