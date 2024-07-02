import { Controller, Get, Param, Post, Req, Body, Delete, Put, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BooksService } from './books.service';
import { Request } from 'express';
import { BookDto } from './dto/book.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { Book } from './entities/book.entity';
import { createBookDto } from './dto/createBook.dto';


@Controller('books')
@UseGuards(ThrottlerGuard) //Applying Rate Limiting
export class BooksController {
  constructor(private booksService: BooksService) { }

  //Find all books
  @Get()
  findAll(@Req() request: Request): Promise<BookDto[]> {
    console.log(request.query);
    return this.booksService.findAll(request.query);
  }

  //Find book by id
  @Get(':bookId')
  findBook(@Param('bookId') bookId: string): Promise<BookDto> {
    return this.booksService.findBookById(bookId);
  }

  //Find book's by title
  @Get('/bytitle/:title')
  findBookByTitle(@Param('title') title: string): Promise<BookDto[]> {
    return this.booksService.findBookByTitle(title);
  }

  //Create book
  @Post()
  createBook(@Body() newBook: createBookDto): Promise<BookDto> {
    return this.booksService.createBook(newBook);
  }

  //Delete book
  @Delete(':bookId')
  deleteBook(@Param('bookId') bookId: string): Promise<BookDto> {

    return this.booksService.deleteBook(bookId);
  }

  //Update book
  @Put(':bookId')
  updateBook(
    @Param('bookId') bookId: string,
    @Body() newBook: UpdateBookDto): Promise<any> {
    return this.booksService.updateBook(bookId, newBook);
  }
}

