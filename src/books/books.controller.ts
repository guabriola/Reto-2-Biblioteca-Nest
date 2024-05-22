import { Controller, Get, Param, Post, Req, Body, Delete, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { Request } from 'express';

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService){}
    
    @Get()
    findAll(@Req() request: Request) { 
      return this.booksService.findAll(request.query); 
    }

    @Get(':bookId')
    findBook(@Param('bookId') bookId: string){
        return this.booksService.findBook(bookId);
    }

    //Ejemplo para diferenciar que bookId no es siempre la misma variable
    // @Get(':RequestedBookId')
    // findBook(@Param('RequestedBookId') methodBookId: string) {
    //   return this.booksService.findBook(methodBookId);
    // }

    @Post()
    createBook(@Body() body){
        let newBook: any = body;
        return this.booksService.createBook(newBook);
    }

    @Delete(':bookId')
    deleteBook(@Param('bookId') bookId: string){
        return this.booksService.deleteBook(bookId);
    }

    @Put(':bookId')
    updateBook(@Param('bookId') bookId: string, @Body() body){
        let newBook: any = body;
        return this.booksService.updateBook(bookId, newBook);
    }
}

