import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
// import { AllExceptionsFilter } from './common/logger/exception.filter';
import{GlobalExceptionFilter} from './shared/utils/http-exception.filter'
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //  logger will be work when to test to project
    // logger:
    //   process.env.NODE_ENV === 'production'
    // ? ['log', 'error', 'warn']
    //     : ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  //  logger wii be work when to test to project
// اداره الاخطاء و res  علي مدار البروجيكت 
  app.useGlobalFilters(new GlobalExceptionFilter())

  // app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 8000;
  await app.listen(port, '0.0.0.0');

  console.log(`Server running on http://localhost:${port}`);

  // user when run elatic search
  // logger.log(`Search endpoint: GET http://localhost:${port}/products/search`);
}

bootstrap();
