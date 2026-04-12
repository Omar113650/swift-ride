// import {
//   ExceptionFilter, Catch, ArgumentsHost,
//   HttpException, HttpStatus, Logger,
// } from '@nestjs/common';
// import { Request, Response } from 'express';

// @Catch()
// export class GlobalExceptionFilter implements ExceptionFilter {
//   private readonly logger = new Logger(GlobalExceptionFilter.name);

//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx      = host.switchToHttp();
//     const response = ctx.getResponse<Response>();
//     const request  = ctx.getRequest<Request>();

//     let status  = HttpStatus.INTERNAL_SERVER_ERROR;
//     let message = 'Internal server error';
//     let code    = 'INTERNAL_ERROR';

//     if (exception instanceof HttpException) {
//       status = exception.getStatus();
//       const res = exception.getResponse() as any;
//       message = typeof res === 'string' ? res : res.message ?? message;
//       code = this.statusToCode(status);
//     } else {
//       this.logger.error('Unhandled exception', exception as Error);
//     }

//     response.status(status).json({
//       success: false,
//       error: {
//         code,
//         message: Array.isArray(message) ? message.join(', ') : message,
//         path: request.url,
//         timestamp: new Date().toISOString(),
//       },
//     });
//   }

//   private statusToCode(status: number): string {
//     const map: Record<number, string> = {
//       400: 'VALIDATION_ERROR',
//       401: 'UNAUTHORIZED',
//       403: 'FORBIDDEN',
//       404: 'NOT_FOUND',
//       422: 'UNPROCESSABLE',
//       429: 'RATE_LIMITED',
//       500: 'INTERNAL_ERROR',
//       503: 'SERVICE_UNAVAILABLE',
//     };
//     return map[status] ?? 'INTERNAL_ERROR';
//   }
// }

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    // 1️⃣ Handle Nest HTTP exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;

      message = typeof res === 'string' ? res : (res.message ?? message);

      code = this.statusToCode(status);
    }

    // 2️⃣ Handle Prisma errors (🔥 المهم)
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      this.logger.error('Prisma error', exception);

      if (exception.code === 'P2002') {
        status = HttpStatus.BAD_REQUEST;
        message = `Duplicate field: ${exception.meta?.target}`;
        code = 'DUPLICATE_FIELD';
      }
    }

    // 3️⃣ Unknown errors
    else {
      this.logger.error('Unhandled exception', exception as Error);
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

  private statusToCode(status: number): string {
    const map: Record<number, string> = {
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
}
