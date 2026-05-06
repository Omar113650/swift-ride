"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupMiddleware = setupMiddleware;
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const cors_1 = __importDefault(require("cors"));
function setupMiddleware(app) {
    const isProduction = process.env.NODE_ENV === 'production';
    app.use((0, compression_1.default)());
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: isProduction ? undefined : false,
        crossOriginEmbedderPolicy: isProduction ? undefined : false,
    }));
    app.use((0, hpp_1.default)());
    app.use((0, cors_1.default)({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
}
//# sourceMappingURL=app.middleware.js.map