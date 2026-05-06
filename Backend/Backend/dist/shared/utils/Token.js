"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const generateTokens = async (jwtService, user) => {
    const payload = {
        sub: user.id,
        role: user.role,
        rideId: user.rideId,
    };
    const [accessToken, refreshToken] = await Promise.all([
        jwtService.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
        }),
        jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
        }),
    ]);
    return {
        accessToken,
        refreshToken,
    };
};
exports.generateTokens = generateTokens;
//# sourceMappingURL=Token.js.map