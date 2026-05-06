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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./shared/utils/http-exception.filter");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const api_1 = require("@bull-board/api");
const bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
const express_1 = require("@bull-board/express");
const nest_winston_1 = require("nest-winston");
const winston = __importStar(require("winston"));
const logging_interceptor_1 = require("./common/logger/logging.interceptor");
const app_middleware_1 = require("./app.middleware");
async function bootstrap() {
    const logger = nest_winston_1.WinstonModule.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.timestamp(), winston.format.printf(({ level, message, context, timestamp }) => {
                    return `[Nest] ${process.pid} - ${new Date(timestamp).toLocaleString()} ${level}${context ? ' [' + context + ']' : ''} ${message}`;
                })),
            }),
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            }),
            new winston.transports.File({
                filename: 'logs/combined.log',
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            }),
        ],
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: process.env.NODE_ENV === 'production'
            ? ['log', 'error', 'warn']
            : ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    app.setGlobalPrefix('api');
    app.use((0, cookie_parser_1.default)());
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    const serverAdapter = new express_1.ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');
    (0, api_1.createBullBoard)({
        queues: [new bullMQAdapter_1.BullMQAdapter(app.get('BullQueue_ride'))],
        serverAdapter,
    });
    app.use('/admin/queues', serverAdapter.getRouter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter());
    (0, app_middleware_1.setupMiddleware)(app);
    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    logger.log(`Server running on http://localhost:${port}`);
    logger.log(`Search endpoint: GET http://localhost:${port}/products/search`);
}
bootstrap();
//# sourceMappingURL=main.js.map