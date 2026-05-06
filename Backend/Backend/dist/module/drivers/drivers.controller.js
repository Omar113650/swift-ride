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
exports.DriverController = void 0;
const common_1 = require("@nestjs/common");
const drivers_service_1 = require("./drivers.service");
const create_driver_dto_1 = require("./dto/create-driver.dto");
const update_driver_dto_1 = require("./dto/update-driver.dto");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const roles_guard_1 = require("../../core/guards/roles.guard");
const throttler_1 = require("@nestjs/throttler");
const client_1 = require("@prisma/client");
let DriverController = class DriverController {
    driverService;
    constructor(driverService) {
        this.driverService = driverService;
    }
    create(userId, dto) {
        return this.driverService.createDriver(userId, dto);
    }
    update(driverId, dto) {
        return this.driverService.updateDriver(driverId, dto);
    }
    updateStatus(driverId, status) {
        return this.driverService.updateStatus(driverId, status);
    }
    updateLocationByAddress(driverId, body) {
        return this.driverService.updateLocationByAddress(driverId, body.address);
    }
    getRides(driverId) {
        return this.driverService.getDriverRides(driverId);
    }
    async getDrivers(req, query) {
        return this.driverService.getDrivers(req, query);
    }
    findNearby(lat, lng) {
        return this.driverService.findNearbyDrivers(+lat, +lng);
    }
    search(query) {
        return this.driverService.searchDrivers(query);
    }
    getWallet(driverId) {
        return this.driverService.getWallet(driverId);
    }
};
exports.DriverController = DriverController;
__decorate([
    (0, common_1.Post)(':userId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('DRIVER'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_driver_dto_1.CreateDriverDto]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':driverId'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('DRIVER'),
    __param(0, (0, common_1.Param)('driverId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_driver_dto_1.UpdateDriverDto]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':driverId/status'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('DRIVER'),
    __param(0, (0, common_1.Param)('driverId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':driverId/location/address'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('DRIVER'),
    __param(0, (0, common_1.Param)('driverId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "updateLocationByAddress", null);
__decorate([
    (0, common_1.Get)(':driverId/rides'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('DRIVER'),
    __param(0, (0, common_1.Param)('driverId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "getRides", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('DRIVER'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DriverController.prototype, "getDrivers", null);
__decorate([
    (0, common_1.Get)('nearby'),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('DRIVER'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "findNearby", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':driverId/wallet'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('DRIVER'),
    __param(0, (0, common_1.Param)('driverId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DriverController.prototype, "getWallet", null);
exports.DriverController = DriverController = __decorate([
    (0, common_1.Controller)('drivers'),
    __metadata("design:paramtypes", [drivers_service_1.DriverService])
], DriverController);
//# sourceMappingURL=drivers.controller.js.map