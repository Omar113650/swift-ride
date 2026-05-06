"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('email', () => ({
    host: process.env.EMAIL_HOST || 'localhost',
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USERNAME || '',
    pass: process.env.EMAIL_PASSWORD || '',
}));
//# sourceMappingURL=email.config.js.map