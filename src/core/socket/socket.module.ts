import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { AppGateway } from '../gateways/chat.gateway';
import { RideTrackingService } from '../../module/rides/track-live location/ride-tracking.service';

@Module({
  providers: [SocketService, AppGateway, RideTrackingService],
  exports: [SocketService],
})
export class SocketModule {}
