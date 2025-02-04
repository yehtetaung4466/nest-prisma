import { HttpException, HttpStatus, ParseArrayPipe, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import serverless from 'serverless-http';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from 'src/app.module';
import { GeneralErrorException, GeneralHttpException } from 'src/core/exceptions';
import DAO from './shared/classes/dao';

const binaryMimeTypes = [
  'application/octet-stream',
  'image/*',
  'multipart/form-data'

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
  const contentType = event.headers["Content-Type"] || event.headers["content-type"];

  // if (!contentType) {
  //   throw new HttpException(["Missing content type."],HttpStatus.BAD_REQUEST);
  // }

  // if (contentType.includes("multipart/form-data")) {
  //   // Handle multipart/form-data
  //     const fields = await parse(event); // Ensure multipart parser is properly configured
  //     const payload = fields;
  //     console.log(payload);
      
  // }
  

  
  
  try {
    // await parse(event)
    
      const server = await bootstrap();
      return server(event, context);
      return {
        statusCode: 200,
        body: JSON.stringify(new DAO(['hi'],{})),
    };
      
  }
  catch (error) {
    console.log(error);
    
      return {
          statusCode: 500,
          body: JSON.stringify(new DAO(['Internal server error'],error)),
      };
  }
};