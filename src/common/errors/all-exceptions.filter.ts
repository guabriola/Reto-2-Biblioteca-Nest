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

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const errorResponse = {
        statusCode: status,
        path: request.url,
        message: exception.message,
        ...(typeof exceptionResponse === 'object' ? exceptionResponse : { detail: exceptionResponse })

      };

      // Log the error details
      this.loggerService.error({
        message: exception.message,
        path: request.url,
        method: request.method,
        headers: request.headers,
        body: request.body,
        params: request.params,
        query: request.query,
      });

      response.status(status).json(errorResponse);
    } else {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = 'Internal server error';
      const errorResponse = {
        statusCode: status,
        path: request.url,
        message: message,
        detail: 'An unexpected error occurred. Please try again later.',
      };

      // Log the error details with full information
      this.loggerService.error({
        message: message,
        path: request.url,
        method: request.method,
        headers: request.headers,
        body: request.body,
        params: request.params,
        //All exception information for developers
        exception: exception instanceof Error ? exception.stack : exception,
      });

      response.status(status).json(errorResponse);
    }
  }


  // catch(exception: unknown, host: ArgumentsHost) {
  //   const ctx = host.switchToHttp(); // Because it is a Api REST.
  //   const response = ctx.getResponse<Response>();
  //   const request = ctx.getRequest<Request>();

  //   let status = HttpStatus.INTERNAL_SERVER_ERROR;
  //   let message = 'Internal server error';
  //   let errorResponse: any = {
  //     statusCode: status,
  //     path: request.url,
  //     message,
  //   };

  //   if (exception instanceof HttpException) {
  //     status = exception.getStatus();
  //     message = exception.message;
  //     errorResponse = {
  //       statusCode: status,
  //       path: request.url,
  //       message: exception.message,
  //     };
  //   }

  //   // Log the error details
  //   this.loggerService.error({
  //     message: message,
  //     path: request.url,
  //     //Data of the request - complete information of the request
  //     method: request.method,
  //     headers: request.headers,
  //     body: request.body,
  //     params: request.params,
  //     query: request.query,
  //     //All exception information
  //     exception: exception instanceof Error ? exception.stack : exception,


  //     //Less exception information.
  //     // exception: exception instanceof Error ? exception : exception,
  //   });

  //   response.status(status).json(errorResponse);
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