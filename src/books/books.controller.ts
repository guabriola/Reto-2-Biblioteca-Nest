import { Controller, Get, Param, Post, Req, Body, Delete, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { Request } from 'express';
import { BookDto } from './dto/book.dto';
import { Book } from './entities/book.entity';
import { UpdateResult } from 'typeorm';
import { UpdateBookDto } from './dto/updateBook.dto';


@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) { }

  @Get()
  findAll(@Req() request: Request): Promise<BookDto[]> {
    console.log(request.query);
    return this.booksService.findAll(request.query);
  }

  @Get(':bookId')
  findBook(@Param('bookId') bookId: string): Promise<BookDto> {
    return this.booksService.findBook(bookId);
  }


  @Post()
  createBook(@Body() newBook: BookDto): Promise<BookDto> {
    return this.booksService.createBook(newBook);
  }

  @Delete(':bookId')
  deleteBook(@Param('bookId') bookId: string): Promise<BookDto> {

    return this.booksService.deleteBook(bookId);
  }

  @Put(':bookId')
  updateBook(
    @Param('bookId') bookId: string,
    @Body() newBook: UpdateBookDto): Promise<UpdateResult> {
    return this.booksService.updateBook(bookId, newBook);
  }
}

