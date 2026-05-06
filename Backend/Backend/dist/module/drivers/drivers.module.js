"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriversModule = void 0;
const common_1 = require("@nestjs/common");
const drivers_service_1 = require("./drivers.service");
const drivers_controller_1 = require("./drivers.controller");
const users_module_1 = require("../users/users.module");
const auth_middleware_1 = require("../../core/middleware/auth/auth.middleware");
const geocoding_module_1 = require("../rides/Geocoding/geocoding.module");
const logger_module_1 = require("../../common/logger/logger.module");
let DriversModule = class DriversModule {
    configure(consumer) {
        consumer.apply(auth_middleware_1.AuthMiddleware).forRoutes(drivers_controller_1.DriverController);
    }
};
exports.DriversModule = DriversModule;
exports.DriversModule = DriversModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, geocoding_module_1.GeocodingModule, logger_module_1.LoggerModule],
        controllers: [drivers_controller_1.DriverController],
        providers: [drivers_service_1.DriverService],
    })
], DriversModule);
//# sourceMappingURL=drivers.module.js.map