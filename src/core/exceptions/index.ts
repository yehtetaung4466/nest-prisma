import {
    Catch,
    ArgumentsHost,
    HttpException,
    ExceptionFilter,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
import DAO from '../../shared/classes/dao';

  
  @Catch(HttpException)
  export class GeneralHttpException implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus();
      console.log(exception);
      
      // const message = exception.message
      response.status(status).json(exception.getResponse());
    }
  }
  
  @Catch()
  export class GeneralErrorException implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
      console.log(exception);
      response.status(status).json(new DAO(['internal server error']));
    }
  }