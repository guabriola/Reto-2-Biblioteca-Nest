import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { configService } from './config.service';
import { ReservationsService } from './reservations/reservations.service';
import { ReservationsController } from './reservations/reservations.controller';


@Module({
  imports: [
    BooksModule,
    TypeOrmModule.forRoot(
      //Configuration from config.servie with env variables.
      configService.getTypeOrmConfig(),
    ),
  ],
  controllers: [AppController, ReservationsController],
  providers: [AppService, ReservationsService],
})
export class AppModule {}
