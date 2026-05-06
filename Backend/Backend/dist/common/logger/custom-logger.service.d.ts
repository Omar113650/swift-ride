import { LoggerService } from '@nestjs/common';
export declare class CustomLoggerService implements LoggerService {
    log(message: any, context?: string): void;
    error(message: any, trace?: string, context?: string): void;
    warn(message: any, context?: string): void;
}
