import { Body, Injectable, NestMiddleware } from '@nestjs/common';
import { time, timeStamp } from 'console';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log(`Request: ${req.method}, ${req.originalUrl}, ${new Date()}`);
    console.log(req.body);
    next();
  }
}