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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AuthMiddleware = class AuthMiddleware {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async use(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                    message: 'Unauthorized access - No token provided',
                });
            }
            const token = authHeader.split(' ')[1];
            try {
                const payload = await this.jwtService.verifyAsync(token, {
                    secret: process.env.JWT_ACCESS_SECRET,
                    algorithms: ['HS256'],
                });
                req['User'] = payload;
                return next();
            }
            catch (accessError) {
                if (accessError.name === 'JsonWebTokenError' ||
                    accessError.name === 'TokenExpiredError') {
                    try {
                        const refreshPayload = await this.jwtService.verifyAsync(token, {
                            secret: process.env.JWT_REFRESH_SECRET,
                            algorithms: ['HS256'],
                        });
                        req['User'] = refreshPayload;
                        req['isRefreshToken'] = true;
                        return next();
                    }
                    catch (refreshError) {
                        console.log('Refresh Token also failed:', refreshError.message);
                    }
                }
            }
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                message: 'Invalid or expired token',
                details: 'Both access and refresh tokens are invalid',
            });
        }
        catch (error) {
            console.log(' JWT ERROR Full Details:', {
                name: error.name,
                message: error.message,
            });
            return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                message: 'Invalid or expired token',
                details: error.message,
            });
        }
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map