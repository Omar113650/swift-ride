import { Server, Socket } from 'socket.io';
export declare class RideService {
    private readonly prisma;
    private readonly redis;
    server: Server;
    constructor(prisma: any, redis: any);
    handleDriverLocation(data: any): Promise<void>;
    handleJoinRide(data: any, socket: Socket): void;
    getLastLocation(data: any): Promise<any>;
    finishRide(rideId: string): Promise<{
        route: any;
    }>;
    getRideRoute(rideId: string): Promise<any>;
}
