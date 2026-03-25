import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './common/logger/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production'
        ? ['log', 'error', 'warn']
        : ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 8000;
  await app.listen(port, '0.0.0.0');

  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();

// HEAD → الكود بتاعك
// الكود التاني → جاي من branch تاني

// وإنت لازم تختار أو تدمج بينهم يدويًا.

// لو عملت تعديل ولسه مسمعش ف المشروع ف اعمل دي
// ctr+shfit+p
// TypeScript: Restart TS Server
