import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RideTrackingService } from '../../../module/rides/track-live location/ride-tracking.service';
type Role = 'DRIVER' | 'RIDER';
export declare class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly rideTrackingService;
    server: Server;
    constructor(rideTrackingService: RideTrackingService);
    private clientsMap;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    getClient(userId: string): {
        socketId: string;
        role: Role;
    } | undefined;
    emitToUser(userId: string, event: string, data: any): void;
    emitToAllDrivers(event: string, data: any): void;
    handleMessage(data: {
        toUserId: string;
        message: string;
    }, client: Socket): void;
    broadcast(event: string, data: any): void;
    handleLocation(data: any): Promise<void>;
}
export {};
