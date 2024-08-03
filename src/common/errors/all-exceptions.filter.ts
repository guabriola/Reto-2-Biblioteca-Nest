import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

//This filter manage all errors - Does't matter the error, the application never crash.
//First checks if it a HttpException, if is not it will return an INTERNAL_SERVER_ERROR.
@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();//Bcause it is a Api REST.
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if(exception instanceof HttpException){
        const status = exception.getStatus();
        response
        .status(status)
        .json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: exception.message,
        });
    }else{
        response.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: 'Internal Server Error!',
        })
    }

  }
}