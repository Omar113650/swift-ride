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
exports.VehicleController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const vehicle_service_1 = require("./vehicle.service");
const create_vehicles_dto_1 = require("./dto/create-vehicles.dto");
const update_vehicles_dto_1 = require("./dto/update-vehicles.dto");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const roles_guard_1 = require("../../core/guards/roles.guard");
let VehicleController = class VehicleController {
    vehicleService;
    constructor(vehicleService) {
        this.vehicleService = vehicleService;
    }
    async addVehicle(driverId, dto, image) {
        return this.vehicleService.addVehicle(dto, driverId, image);
    }
    async getVehicles(driverId) {
        return this.vehicleService.getVehicles(driverId);
    }
    async getVehicle(id) {
        return this.vehicleService.getVehicleById(id);
    }
    async deleteVehicle(id) {
        return this.vehicleService.deleteVehicle(id);
    }
    async updateVehicle(id, dto, image) {
        return this.vehicleService.updateVehicle(id, dto, image);
    }
};
exports.VehicleController = VehicleController;
__decorate([
    (0, common_1.Post)('add-vehicle/:driverId'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('DRIVER'),
    __param(0, (0, common_1.Param)('driverId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_vehicles_dto_1.CreateVehicleDto, Object]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "addVehicle", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('DRIVER'),
    (0, common_1.Get)(':driverId'),
    __param(0, (0, common_1.Param)('driverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicles", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('DRIVER', 'ADMIN'),
    (0, common_1.Get)('single/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "getVehicle", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('DRIVER', 'ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "deleteVehicle", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('DRIVER', 'ADMIN'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_vehicles_dto_1.UpdateVehicleDto, Object]),
    __metadata("design:returntype", Promise)
], VehicleController.prototype, "updateVehicle", null);
exports.VehicleController = VehicleController = __decorate([
    (0, common_1.Controller)('vehicles'),
    __metadata("design:paramtypes", [vehicle_service_1.VehicleService])
], VehicleController);
//# sourceMappingURL=vehicle.controller.js.map