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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const login_user_dto_1 = require("./dto/login-user.dto");
const GoogleAuthGuard_1 = require("./Strategy/GoogleAuthGuard");
const throttler_1 = require("@nestjs/throttler");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async register(body, res) {
        return await this.userService.Register(body, res);
    }
    async login(body, res) {
        return await this.userService.login(body, res);
    }
    async logout(res) {
        return await this.userService.logout(res);
    }
    async findUser() {
        return await this.userService.GetProfile();
    }
    async refreshToken(req, res) {
        const refreshToken = req.cookies?.RefreshToken;
        return await this.userService.refreshToken(refreshToken, res);
    }
    googleLogin() {
        return 'redirecting...';
    }
    googleCallback(req) {
        return this.userService.googleLogin(req.user);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor),
    (0, swagger_1.ApiOperation)({ summary: 'Register new user ' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(201),
    (0, swagger_1.ApiOperation)({ summary: 'Login user and set authentication cookies' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Logout user and clear cookies' }),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Get)('found-user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUser", null);
__decorate([
    (0, common_1.Post)('refresh-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token using refresh token' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Get)('google/login'),
    (0, common_1.UseGuards)(GoogleAuthGuard_1.GoogleAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "googleLogin", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)(GoogleAuthGuard_1.GoogleAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "googleCallback", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('authentication'),
    (0, common_1.Controller)('auth'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __metadata("design:paramtypes", [users_service_1.UserService])
], UserController);
//# sourceMappingURL=users.controller.js.map