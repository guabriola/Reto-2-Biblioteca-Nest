import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksService } from './books/books.service';
import { BooksController } from './books/books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [

    //Lo cargo asi porque con la configuración de ormconfig.json no funciona
    //Más adelante lo cambio por variables de entorno.
    TypeOrmModule.forRoot({
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "password",
      "database": "reto2_library",
      "entities": ["dist/**/*.entity{.ts,.js}"], 
      "synchronize": true 
  }),
  ],
  controllers: [AppController, BooksController],
  providers: [AppService, BooksService],
})
export class AppModule {}
