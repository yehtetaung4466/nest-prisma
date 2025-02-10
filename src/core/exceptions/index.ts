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
      const status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      console.log(exceptionResponse);
      
      
      
      
      let message:string[]

      if(typeof exceptionResponse === 'string') {
        message = [exceptionResponse]
      }else {
        message = exceptionResponse["message"] ? [...exceptionResponse["message"]] : [exception.message]
      }


      // if(typeof exception.message === 'string' ) {
      //   message = [exception.message]
      // }else if(Array.isArray(exception.message)){
      //   message = [...exception.message]
      // }
      response.status(status).json({
        message,
      });
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
      response.status(status).json(new DAO(['Internal server error']));
    }
  }