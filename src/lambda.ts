import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import serverless from 'serverless-http';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { AppModule } from 'src/app.module';
import { GeneralErrorException, GeneralHttpException } from 'src/shared/exceptions';

const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/pdf',
  'application/octet-stream',
  'application/xml',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml',
  'image/x-icon',
  'image/svg+xml',
  'application/x-font-ttf',
  'font/ttf',
  'font/otf',
  'multipart/form-data'
];

async function bootstrap() {
  const app = express();
  const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(app));

  nestApp.setGlobalPrefix('/api');
  nestApp.enableCors();
  nestApp.useGlobalFilters(new GeneralErrorException(), new GeneralHttpException());
  nestApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await nestApp.init();

  // Lambda handler for serverless deployment
  return serverless(app, {
    binary: binaryMimeTypes,
  });
}

bootstrap().then((handler) => {
  module.exports.handler = handler;
});
