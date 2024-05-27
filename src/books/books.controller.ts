import { Controller, Get, Param, Post, Req, Body, Delete, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { Request } from 'express';
import { BookDto } from './dto/book.dto';
import { Book } from './entities/book.entity';


@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService){}
    
    @Get()
    findAll(@Req() request: Request): Promise<Book[]> { 
      console.log(request.query);
      return this.booksService.findAll(request.query);
    }
  
    @Get(':bookId')
    findBook(@Param('bookId') bookId: string): Promise<Book> {
      return this.booksService.findBook(bookId);
    }


    @Post()
    createBook(@Body() newBook: BookDto) : Promise<Book>{
        return this.booksService.createBook(newBook);
    }

    @Delete(':bookId')
    deleteBook(@Param('bookId') bookId: string) : Promise<Book>{
        //deleteBook(@Param('bookId') bookId: string): Promise<Book> { //The guy from the tutorial
        //used type Book for the promise. I will try with any firts.
        return this.booksService.deleteBook(bookId);
    }

    @Put(':bookId')
    updateBook(
        @Param('bookId') bookId: string, 
        @Body() newBook: BookDto): Promise<Book>{
            return this.booksService.updateBook(bookId, newBook);
    }
}

