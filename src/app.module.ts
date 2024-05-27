import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { configService } from './config.service';
import { ReservationsModule } from './reservations/reservations.module';


@Module({
  imports: [
    BooksModule,
    TypeOrmModule.forRoot(
      //Configuration from config.servie with env variables.
      configService.getTypeOrmConfig(),
    ),
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
