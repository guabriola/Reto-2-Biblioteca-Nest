import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { configService } from './config.service';
import { ReservationsModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { BooksController } from './books/books.controller';
import { UsersController } from './users/users.controller';
import { ReservationsController } from './reservations/reservations.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core/constants';


@Module({
  imports: [
    BooksModule,
    TypeOrmModule.forRoot(
      //Configuration from config.servie with env variables.
      configService.getTypeOrmConfig(),
    ),
    ReservationsModule,
    UsersModule,
    ThrottlerModule.forRoot([{
      //To protect applications from brute-force attacks ---> rate-limiting
      ttl: 60000,
      limit: 10,
    }]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      //These makes the JwtAuth global
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //Options for configuration
    // consumer.apply(LoggerMiddleware).forRoutes('songs'); // option no 1
    // consumer
    //   .apply(LoggerMiddleware)
    //   .forRoutes({ path: 'songs', method: RequestMethod.POST }); //option no 2
    consumer.apply(LoggerMiddleware).forRoutes(BooksController, UsersController, ReservationsController); //option no 3
  }
}
