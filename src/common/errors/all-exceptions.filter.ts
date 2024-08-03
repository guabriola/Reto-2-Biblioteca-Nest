import { Catch, ArgumentsHost, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { LoggerService } from '../services/logger/logger.service';

//This filter manage all errors - Does't matter the error, the application never crash.
//First checks if it a HttpException, if is not it will return an INTERNAL_SERVER_ERROR.


@Catch()
export class AllExceptionFilter extends BaseExceptionFilter {
  constructor(
    @Inject(LoggerService) private readonly loggerService: LoggerService,
  ) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // Because it is a Api REST.
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorResponse: any = {
      statusCode: status,
      // timestamp: new Date().toISOString(),
      path: request.url,
      message,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      errorResponse = {
        statusCode: status,
        // timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message,
      };
    }

    // Log the error details
    this.loggerService.error({
      message: message,
      path: request.url,
      // timestamp: new Date().toISOString(),
      //Data of the request - TODO Check what information it necessary and what is not.
      method: request.method,
      headers: request.headers,
      body: request.body,
      params: request.params,
      query: request.query,
      //exception: exception instanceof Error ? exception.stack : exception,
      //Delete exception.stack because it was to much information.
      exception: exception instanceof Error ? exception : exception,
    });

    response.status(status).json(errorResponse);
  }
}



// @Catch()
// export class AllExceptionFilter extends BaseExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();//Bcause it is a Api REST.
//     const response = ctx.getResponse<Response>();
//     const request = ctx.getRequest<Request>();

//     if(exception instanceof HttpException){
//         const status = exception.getStatus();
//         response
//         .status(status)
//         .json({
//           statusCode: status,
//           timestamp: new Date().toISOString(),
//           path: request.url,
//           message: exception.message,
//         },);

        
//     }else{
//         response.status(HttpStatus.INTERNAL_SERVER_ERROR)
//         .json({
//             statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//             timestamp: new Date().toISOString(),
//             path: request.url,
//             message: 'Internal Server Error!',
//             detail: 'An unexpected error occurred. Please try again later.',
//         })
//     }

//   }
// }