"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookies = void 0;
const setAuthCookies = (res, accessToken, refreshToken) => {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('AccessToken', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000,
    });
    res.cookie('RefreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
exports.setAuthCookies = setAuthCookies;
//# sourceMappingURL=setAuthCookies.js.map