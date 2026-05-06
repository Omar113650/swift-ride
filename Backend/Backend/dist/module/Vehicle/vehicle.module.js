"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleModule = void 0;
const common_1 = require("@nestjs/common");
const vehicle_service_1 = require("./vehicle.service");
const vehicle_controller_1 = require("./vehicle.controller");
const cloudinary_service_1 = require("../../core/cloudinary/cloudinary.service");
const roles_guard_1 = require("../../core/guards/roles.guard");
const auth_middleware_1 = require("../../core/middleware/auth/auth.middleware");
const users_module_1 = require("../users/users.module");
const drivers_module_1 = require("../drivers/drivers.module");
const cloudinary_module_1 = require("../../core/cloudinary/cloudinary.module");
let VehicleModule = class VehicleModule {
    configure(consumer) {
        consumer.apply(auth_middleware_1.AuthMiddleware).forRoutes(vehicle_controller_1.VehicleController);
    }
};
exports.VehicleModule = VehicleModule;
exports.VehicleModule = VehicleModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, drivers_module_1.DriversModule, cloudinary_module_1.CloudinaryModule],
        controllers: [vehicle_controller_1.VehicleController],
        providers: [vehicle_service_1.VehicleService, cloudinary_service_1.CloudinaryService, roles_guard_1.RolesGuard],
    })
], VehicleModule);
//# sourceMappingURL=vehicle.module.js.map