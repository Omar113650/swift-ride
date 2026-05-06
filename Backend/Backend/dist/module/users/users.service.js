"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const class_transformer_1 = require("class-transformer");
const Token_1 = require("../../shared/utils/Token");
const setAuthCookies_1 = require("../../shared/utils/setAuthCookies");
let UserService = class UserService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async Register(createUserDto, res) {
        const existingEmail = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (existingEmail) {
            throw new common_1.BadRequestException('this email is already exist');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const newUser = await this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
        });
        const tokens = await (0, Token_1.generateTokens)(this.jwtService, newUser);
        (0, setAuthCookies_1.setAuthCookies)(res, tokens.accessToken, tokens.refreshToken);
        return {
            message: 'email register success',
            user: newUser,
            tokens,
        };
    }
    async login(loginDto, res) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });
        if (!user) {
            throw new common_1.BadRequestException('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new common_1.BadRequestException('Invalid email or password');
        }
        const tokens = await (0, Token_1.generateTokens)(this.jwtService, user);
        (0, setAuthCookies_1.setAuthCookies)(res, tokens.accessToken, tokens.refreshToken);
        const safeUser = (0, class_transformer_1.plainToInstance)(Object, user);
        return {
            user: safeUser,
            tokens,
        };
    }
    async logout(res) {
        const isProd = process.env.NODE_ENV === 'production';
        res.clearCookie('AccessToken', {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
        });
        res.clearCookie('RefreshToken', {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax',
        });
        return { message: 'Logged out successfully' };
    }
    async refreshToken(refreshToken, res) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('No refresh token provided');
        }
        let decoded;
        try {
            decoded = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: decoded.sub },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                isActive: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { accessToken, refreshToken: newRefreshToken } = await (0, Token_1.generateTokens)(this.jwtService, user);
        (0, setAuthCookies_1.setAuthCookies)(res, accessToken, newRefreshToken);
        return {
            message: 'Access token refreshed successfully',
            accessToken,
            user,
        };
    }
    async GetProfile() {
        const users = await this.prisma.user.findMany();
        if (!users || users.length === 0) {
            throw new common_1.NotFoundException('No users found');
        }
        return users;
    }
    async googleLogin(data) {
        const { email, name, googleId } = data;
        let googleAccount = await this.prisma.googleAccount.findUnique({
            where: { googleId },
            include: { user: true },
        });
        if (!googleAccount) {
            const user = await this.prisma.user.create({
                data: {
                    name,
                    email,
                    password: '',
                    phone: '',
                    googleAccount: {
                        create: {
                            googleId,
                            email,
                        },
                    },
                },
                include: {
                    googleAccount: true,
                },
            });
            return {
                message: 'Login successful',
                user,
            };
        }
        return {
            message: 'Login successful',
            user: googleAccount.user,
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=users.service.js.map