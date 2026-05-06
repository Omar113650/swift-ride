"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const ride_tracking_service_1 = require("../../../module/rides/track-live location/ride-tracking.service");
let AppGateway = class AppGateway {
    rideTrackingService;
    server;
    constructor(rideTrackingService) {
        this.rideTrackingService = rideTrackingService;
    }
    clientsMap = new Map();
    handleConnection(client) {
        const userId = client.handshake.query.userId;
        const role = client.handshake.query.role;
        if (!userId || !role) {
            client.disconnect();
            return;
        }
        this.clientsMap.set(userId, {
            socketId: client.id,
            role,
        });
    }
    handleDisconnect(client) {
        for (const [userId, data] of this.clientsMap.entries()) {
            if (data.socketId === client.id) {
                this.clientsMap.delete(userId);
                break;
            }
        }
    }
    getClient(userId) {
        return this.clientsMap.get(userId);
    }
    emitToUser(userId, event, data) {
        const client = this.getClient(userId);
        if (!client) {
            console.log(`⚠️ User not connected: ${userId}`);
            return;
        }
        this.server.to(client.socketId).emit(event, data);
    }
    emitToAllDrivers(event, data) {
        for (const [, client] of this.clientsMap.entries()) {
            if (client.role === 'DRIVER') {
                this.server.to(client.socketId).emit(event, data);
            }
        }
    }
    handleMessage(data, client) {
        const sender = [...this.clientsMap.entries()].find(([, value]) => value.socketId === client.id);
        if (!sender)
            return;
        const [fromUserId] = sender;
        this.emitToUser(data.toUserId, 'receive_message', {
            from: fromUserId,
            message: data.message,
        });
    }
    broadcast(event, data) {
        this.server.emit(event, data);
    }
    async handleLocation(data) {
        console.log(' DRIVER LOCATION RECEIVED:', data);
        await this.rideTrackingService.updateDriverLocation(data);
    }
};
exports.AppGateway = AppGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AppGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], AppGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('driver-location'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "handleLocation", null);
exports.AppGateway = AppGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
    }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ride_tracking_service_1.RideTrackingService])
], AppGateway);
//# sourceMappingURL=chat.gateway.js.map