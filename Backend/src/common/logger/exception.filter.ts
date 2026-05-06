import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();

    console.error({
      message: exception.message,
      url: req.url,
      method: req.method,
      correlationId: req.correlationId,
    });
  }
}