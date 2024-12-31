import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { HttpExceptionFilter } from '@entrypoints/web/shared/middleware/exceptions/filters';
import { CustomValidationPipe } from '@src/entrypoints/web/shared/middleware/exceptions';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as compression from 'compression';
import helmet from 'helmet';
import { SetupRedoc, SwaggerDoc } from '@src/entrypoints/web/config/swagger';

async function bootstrap() {
  const HOST = '0.0.0.0';
  const PORT = 3000;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  SwaggerDoc(app);
  SetupRedoc(app);

  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ limit: '20mb', extended: true }));
  app.use(helmet());
  app.use(compression());

  await app.listen(PORT, HOST);

  Logger.log(`Server running on http://${HOST}:${PORT}`, 'Bootstrap');
}

bootstrap();
