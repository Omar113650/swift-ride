import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< HEAD
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './common/logger/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {

    //  التحكم في اللوج
    logger:
      process.env.NODE_ENV === 'production'
        ? ['log', 'error', 'warn']
        : ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.setGlobalPrefix('api');

  // app.use(cookieParser());

  app.enableVersioning({
    type: VersioningType.URI, // النوع
    defaultVersion: '1', // النسخة الافتراضية لو مش محددة
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  ``;
  const port = process.env.PORT || 8000;
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on http://localhost:${port}`);
=======

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
>>>>>>> 9e2e0c490e798f245057b871520a2347323cb7b2
}
bootstrap();
