import { Body, Injectable, NestMiddleware } from '@nestjs/common';
import { time, timeStamp } from 'console';
import { callbackify } from 'util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    //Console.log of every CRUD petition
    console.log(`Request: ${req.method}, ${req.originalUrl}, Username: ${req.params.userName}, Role: ${req.params.roleName}`);
    // console.log(req.params);
    // console.log(res);
    next();
  }
}