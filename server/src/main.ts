import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import uploadConfig from './config/upload';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(uploadConfig.tmpFolder);
  app.enableCors();
  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(3333);
}

bootstrap();
