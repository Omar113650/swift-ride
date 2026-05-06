"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let code = 'INTERNAL_ERROR';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'string' ? res : (res.message ?? message);
            code = this.statusToCode(status);
        }
        else if (exception instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            this.logger.error('Prisma error', exception);
            if (exception.code === 'P2002') {
                status = common_1.HttpStatus.BAD_REQUEST;
                message = `Duplicate field: ${exception.meta?.target}`;
                code = 'DUPLICATE_FIELD';
            }
        }
        else {
            this.logger.error('Unhandled exception', exception);
        }
        response.status(status).json({
            success: false,
            error: {
                code,
                message: Array.isArray(message) ? message.join(', ') : message,
                path: request.url,
                timestamp: new Date().toISOString(),
            },
        });
    }
    statusToCode(status) {
        const map = {
            400: 'VALIDATION_ERROR',
            401: 'UNAUTHORIZED',
            403: 'FORBIDDEN',
            404: 'NOT_FOUND',
            422: 'UNPROCESSABLE',
            429: 'RATE_LIMITED',
            500: 'INTERNAL_ERROR',
            503: 'SERVICE_UNAVAILABLE',
        };
        return map[status] ?? 'INTERNAL_ERROR';
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map