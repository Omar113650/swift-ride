"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const google_strategy_1 = require("./Strategy/google.strategy");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    const secret = configService.get('jwt.secret') || 'defaultSecretKey';
                    const expiresIn = configService.get('jwt.expiresIn') || '86400';
                    return {
                        secret,
                        signOptions: { expiresIn: parseInt(expiresIn, 10) },
                    };
                },
            }),
        ],
        controllers: [users_controller_1.UserController],
        providers: [users_service_1.UserService, prisma_service_1.PrismaService, google_strategy_1.GoogleStrategy],
        exports: [jwt_1.JwtModule, users_service_1.UserService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map