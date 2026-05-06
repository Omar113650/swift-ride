"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidsModule = void 0;
const common_1 = require("@nestjs/common");
const bids_service_1 = require("./bids.service");
const bids_controller_1 = require("./bids.controller");
const auth_middleware_1 = require("../../core/middleware/auth/auth.middleware");
const users_module_1 = require("../users/users.module");
const drivers_module_1 = require("../drivers/drivers.module");
const rides_module_1 = require("../rides/rides.module");
const roles_guard_1 = require("../../core/guards/roles.guard");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const socket_module_1 = require("../../core/socket/socket.module");
let BidsModule = class BidsModule {
    configure(consumer) {
        consumer.apply(auth_middleware_1.AuthMiddleware).forRoutes(bids_controller_1.RideBidController);
    }
};
exports.BidsModule = BidsModule;
exports.BidsModule = BidsModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, drivers_module_1.DriversModule, socket_module_1.SocketModule, rides_module_1.RideModule],
        controllers: [bids_controller_1.RideBidController],
        providers: [bids_service_1.RideBidService, prisma_service_1.PrismaService, roles_guard_1.RolesGuard],
    })
], BidsModule);
//# sourceMappingURL=bids.module.js.map