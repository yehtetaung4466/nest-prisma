import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import serverless from 'serverless-http';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from 'src/app.module';
import { GeneralErrorException, GeneralHttpException } from 'src/shared/exceptions';

const binaryMimeTypes = [
  'application/javascript',
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
  'multipart/form-data',
  'image/webp'
];

async function bootstrap() {
  try{
    const app = express();
  const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(app),{logger:false});

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
    
  }catch(error){
    console.error(error);
    throw new Error('bootstrap error')
  }
}

export const  handler = async (event, context) => {
  
  try {
      const server = await bootstrap();
      return server(event, context);
  }
  catch (error) {
      console.error(error);
      return {
          statusCode: 500,
          body: JSON.stringify({ error, message: 'error' }),
      };
  }
};