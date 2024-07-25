import { Controller, Get, Param, Post, Req, Body, Delete, Put, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BooksService } from './books.service';
import { Request } from 'express';
import { BookDto } from './dto/book.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { CreateBookDto } from './dto/createBook.dto';
//Custom decorator for publics routes.
import { Public } from 'src/common/decorators/public-auth.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
@UseGuards(ThrottlerGuard) //Applying Rate Limiting
export class BooksController {
  constructor(private booksService: BooksService) { }

  /**
   * Find all books
   * */
  @ApiResponse({ status: 500, description: 'Internal Server Error'})
  @ApiResponse({ status: 404, description: 'NOT_FOUND - There is no books saved'})
  @Public()
  @Get()
  findAll(@Req() request: Request): Promise<BookDto[]> {
    console.log(request.query);
    return this.booksService.findAll(request.query);
  }

  /**
   * Find book by id
   * */
  @ApiResponse({ status: 404, description: 'NOT_FOUND - There is not book with id xxx'})
  @ApiResponse({ status: 500, description: 'Internal Server Error'})
  @Public()
  @Get(':bookId')
  findBook(@Param('bookId') bookId: string): Promise<BookDto> {
    return this.booksService.findBookById(bookId);
  }

  /**
   * Find book's by title
   * */
  @ApiResponse({ status: 404, description: 'NOT_FOUND - There is not book with title xxx'})
  @ApiResponse({ status: 500, description: 'Internal Server Error'})
  @Public()
  @Get('/bytitle/:title')
  findBookByTitle(@Param('title') title: string): Promise<BookDto[]> {
    return this.booksService.findBookByTitle(title);
  }

  /**
   * Create book
   * */
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @ApiResponse({ status: 500, description: 'Internal Server Error'})
  @ApiBearerAuth()
  @Post()
  createBook(@Body() newBook: CreateBookDto): Promise<BookDto> {
    return this.booksService.createBook(newBook);
  }

  /**
   * Delete book
   * */
  @ApiResponse({ status: 200, description: 'The book with id xxx was deleted'})
  @ApiResponse({ status: 304, description: 'Cant delete, the book it is booked by some user.'})
  @ApiResponse({ status: 404, description: 'NOT_FOUND - There is not book with id xxx'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @ApiResponse({ status: 500, description: 'Internal Server Error'})
  @ApiBearerAuth()
  @Delete(':bookId')
  deleteBook(@Param('bookId') bookId: string): Promise<any> {
    return this.booksService.deleteBook(bookId);
  }

  /**
   * Update book
   * */
  @ApiResponse({ status: 200, description: 'The book with id xxx was updated'})
  @ApiResponse({ status: 400, description: 'Bad request, incorrect data'})
  @ApiResponse({ status: 404, description: 'NOT_FOUND - There is not book with id xxx'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @ApiResponse({ status: 500, description: 'Internal Server Error'})
  @ApiBearerAuth()
  @Put(':bookId')
  updateBook(
    @Param('bookId') bookId: string,
    @Body() newBook: UpdateBookDto): Promise<any> {
    return this.booksService.updateBook(bookId, newBook);
  }
}

