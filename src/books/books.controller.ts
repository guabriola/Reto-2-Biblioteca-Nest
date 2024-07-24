import { Controller, Get, Param, Post, Req, Body, Delete, Put, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BooksService } from './books.service';
import { Request } from 'express';
import { BookDto } from './dto/book.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { CreateBookDto } from './dto/createBook.dto';
//Custom decorator for publics routes.
import { Public } from 'src/common/decorators/public-auth.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
@UseGuards(ThrottlerGuard) //Applying Rate Limiting
export class BooksController {
  constructor(private booksService: BooksService) { }

  //Find all books
  @Public()
  @Get()
  findAll(@Req() request: Request): Promise<BookDto[]> {
    console.log(request.query);
    return this.booksService.findAll(request.query);
  }

  //Find book by id
  @Public()
  @Get(':bookId')
  findBook(@Param('bookId') bookId: string): Promise<BookDto> {
    return this.booksService.findBookById(bookId);
  }

  //Find book's by title
  @Public()
  @Get('/bytitle/:title')
  findBookByTitle(@Param('title') title: string): Promise<BookDto[]> {
    return this.booksService.findBookByTitle(title);
  }

  //Create book
  @ApiBearerAuth()
  @Post()
  createBook(@Body() newBook: CreateBookDto): Promise<BookDto> {
    return this.booksService.createBook(newBook);
  }

  //Delete book
  @ApiBearerAuth()
  @Delete(':bookId')
  deleteBook(@Param('bookId') bookId: string): Promise<BookDto> {

    return this.booksService.deleteBook(bookId);
  }

  //Update book
  @ApiBearerAuth()
  @Put(':bookId')
  updateBook(
    @Param('bookId') bookId: string,
    @Body() newBook: UpdateBookDto): Promise<any> {
    return this.booksService.updateBook(bookId, newBook);
  }
}

