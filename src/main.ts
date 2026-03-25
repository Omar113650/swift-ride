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

  // prefix
  app.setGlobalPrefix('api');

  // versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 8000;
  await app.listen(port, '0.0.0.0');

  console.log(`Server running on http://localhost:${port}`);
}

bootstrap();








// HEAD → الكود بتاعك
// الكود التاني → جاي من branch تاني

// وإنت لازم تختار أو تدمج بينهم يدويًا.