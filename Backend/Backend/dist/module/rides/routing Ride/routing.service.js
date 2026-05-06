"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoutingService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let RoutingService = class RoutingService {
    baseUrl = 'https://router.project-osrm.org/route/v1/driving';
    async getRoute(pickup, destination) {
        try {
            const url = `${this.baseUrl}/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?overview=full&geometries=polyline`;
            const response = await axios_1.default.get(url);
            const route = response.data.routes[0];
            return {
                distance: route.distance / 1000,
                duration: route.duration / 60,
                polyline: route.geometry,
            };
        }
        catch (error) {
            throw new common_1.HttpException('Routing service failed ', 500);
        }
    }
};
exports.RoutingService = RoutingService;
exports.RoutingService = RoutingService = __decorate([
    (0, common_1.Injectable)()
], RoutingService);
//# sourceMappingURL=routing.service.js.map