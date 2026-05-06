import { AppGateway } from './gateways/chat.gateway';
export declare class SocketService {
    private readonly gateway;
    constructor(gateway: AppGateway);
    emitToDriver(driverId: string, event: string, data: any): void;
    emitToAllDrivers(event: string, data: any): void;
    emitToUser(userId: string, event: string, data: any): void;
    sendMessage(fromId: string, toId: string, message: string): void;
}
