import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { configService } from './config.service';
import { ReservationsModule } from './reservations/reservations.module';
// import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    BooksModule,
    TypeOrmModule.forRoot(
      //Configuration from config.servie with env variables.
      configService.getTypeOrmConfig(),
    ),
    ReservationsModule,
    UsersModule,
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
