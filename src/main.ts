import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
// import { AllExceptionsFilter } from './common/logger/exception.filter';
import { GlobalExceptionFilter } from './shared/utils/http-exception.filter'
import cookieParser from 'cookie-parser';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

// ✅ Winston
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';


async function bootstrap() {






const logger = WinstonModule.createLogger({
  transports: [
    // 🎨 Console (شكل حلو)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, context, timestamp }) => {
          return `[Nest] ${process.pid} - ${new Date(timestamp as string).toLocaleString()} ${level}${context ? ' [' + context + ']' : ''} ${message}`;
        }),
      ),
    }),

    // ❌ Errors only
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(), // ✅ مهم جدًا
      ),
    }),

    // 📁 All logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(), // ✅ مهم جدًا
      ),
    }),
  ],
});

  const app = await NestFactory.create(AppModule, {
    //  logger will be work when to test to project
    logger:
      process.env.NODE_ENV === 'production'
    ? ['log', 'error', 'warn']
        : ['log', 'error', 'warn', 'debug', 'verbose'],

    // ✅ ربط Winston
    // logger,
  });

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });





// http://localhost:3000/admin/queues/queue/ride

// 🚀 2. الطريقة الصح (Dashboard)

// لازم تستخدم UI تشوف منه الـ Queue

// 🔥 استخدم:
// 👉 Bull Board

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  createBullBoard({
    queues: [
      new BullMQAdapter(app.get('BullQueue_ride')),
    ],
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());








  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //     transformOptions: { enableImplicitConversion: true },
  //   }),
  // );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  //  logger wii be work when to test to project
  // اداره الاخطاء و res  علي مدار البروجيكت 
  app.useGlobalFilters(new GlobalExceptionFilter())

  // app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  // ❌ console.log
  // console.log(`Server running on http://localhost:${port}`);

  // ✅ استخدم Winston
  logger.log(`Server running on http://localhost:${port}`);

  // user when run elastic search
  logger.log(`Search endpoint: GET http://localhost:${port}/products/search`);
}

bootstrap();