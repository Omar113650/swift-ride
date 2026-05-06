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
exports.RideController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rides_service_1 = require("./rides.service");
const create_ride_dto_1 = require("./dto/create-ride.dto");
const ride_tracking_service_1 = require("./track-live location/ride-tracking.service");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const roles_guard_1 = require("../../core/guards/roles.guard");
const throttler_1 = require("@nestjs/throttler");
let RideController = class RideController {
    rideService;
    tracking;
    constructor(rideService, tracking) {
        this.rideService = rideService;
        this.tracking = tracking;
    }
    async createRide(req, dto) {
        return this.rideService.createRide(req.User.sub, dto);
    }
    async assignDriver(rideId, driverId) {
        return this.rideService.assignDriver(rideId, driverId);
    }
    async startRide(rideId) {
        return this.rideService.startRide(rideId);
    }
    async completeRide(rideId, distance) {
        return this.rideService.completeRide(rideId, distance);
    }
    async cancelRide(rideId, cancelledBy) {
        return this.rideService.cancelRide(rideId, cancelledBy);
    }
    async addRouteHistory(rideId, lat, lng) {
        return this.rideService.addRouteHistory(rideId, lat, lng);
    }
    async getRide(rideId) {
        return this.rideService.getRide(rideId);
    }
    async testLocation(body) {
        return this.tracking.updateDriverLocation(body);
    }
    getLocation(driverId) {
        return this.tracking.getLastLocation(driverId);
    }
    async getRidesStatsByStatus() {
        return this.rideService.getRidesStatsByStatus();
    }
    async getTotalRides() {
        return this.rideService.getTotalRides();
    }
};
exports.RideController = RideController;
__decorate([
    (0, common_1.Post)('add-ride'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new ride' }),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('RIDER', 'DRIVER', 'ADMIN'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_ride_dto_1.CreateRideDto]),
    __metadata("design:returntype", Promise)
], RideController.prototype, "createRide", null);
__decorate([
    (0, common_1.Patch)(':rideId/assign/:driverId'),
    __param(0, (0, common_1.Param)('rideId')),
    __param(1, (0, common_1.Param)('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RideController.prototype, "assignDriver", null);
__decorate([
    (0, common_1.Patch)(':rideId/start'),
    __param(0, (0, common_1.Param)('rideId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RideController.prototype, "startRide", null);
__decorate([
    (0, common_1.Patch)(':rideId/complete'),
    __param(0, (0, common_1.Param)('rideId')),
    __param(1, (0, common_1.Body)('distance')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], RideController.prototype, "completeRide", null);
__decorate([
    (0, common_1.Patch)(':rideId/cancel'),
    __param(0, (0, common_1.Param)('rideId')),
    __param(1, (0, common_1.Body)('cancelledBy')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RideController.prototype, "cancelRide", null);
__decorate([
    (0, common_1.Post)(':rideId/route'),
    __param(0, (0, common_1.Param)('rideId')),
    __param(1, (0, common_1.Body)('lat')),
    __param(2, (0, common_1.Body)('lng')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], RideController.prototype, "addRouteHistory", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Get)(':rideId'),
    __param(0, (0, common_1.Param)('rideId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RideController.prototype, "getRide", null);
__decorate([
    (0, common_1.Post)('tracking/test-location'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RideController.prototype, "testLocation", null);
__decorate([
    (0, common_1.Get)('tracking/:driverId'),
    __param(0, (0, common_1.Param)('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RideController.prototype, "getLocation", null);
__decorate([
    (0, roles_decorator_1.Roles)('RIDER', 'DRIVER', 'ADMIN'),
    (0, common_1.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RideController.prototype, "getRidesStatsByStatus", null);
__decorate([
    (0, roles_decorator_1.Roles)('RIDER', 'DRIVER', 'ADMIN'),
    (0, common_1.Get)('total'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RideController.prototype, "getTotalRides", null);
exports.RideController = RideController = __decorate([
    (0, swagger_1.ApiTags)('Rides'),
    (0, common_1.Controller)('rides'),
    __metadata("design:paramtypes", [rides_service_1.RideService,
        ride_tracking_service_1.RideTrackingService])
], RideController);
//# sourceMappingURL=rides.controller.js.map