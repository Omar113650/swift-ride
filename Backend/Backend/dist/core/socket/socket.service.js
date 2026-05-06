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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const common_1 = require("@nestjs/common");
const chat_gateway_1 = require("./gateways/chat.gateway");
let SocketService = class SocketService {
    gateway;
    constructor(gateway) {
        this.gateway = gateway;
    }
    emitToDriver(driverId, event, data) {
        this.gateway.emitToUser(driverId, event, data);
    }
    emitToAllDrivers(event, data) {
        this.gateway.emitToAllDrivers(event, data);
    }
    emitToUser(userId, event, data) {
        this.gateway.emitToUser(userId, event, data);
    }
    sendMessage(fromId, toId, message) {
        this.gateway.emitToUser(toId, 'receive_message', {
            from: fromId,
            message,
        });
    }
};
exports.SocketService = SocketService;
exports.SocketService = SocketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_gateway_1.AppGateway])
], SocketService);
//# sourceMappingURL=socket.service.js.map