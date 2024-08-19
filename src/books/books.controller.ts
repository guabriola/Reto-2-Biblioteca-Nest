import { Controller, Get, Param, Post, Req, Body, Delete, Put, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BooksService } from './books.service';
import { BookDto } from './dto/book.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { CreateBookDto } from './dto/createBook.dto';
import { Public } from 'src/common/decorators/public-auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HasRoles } from 'src/common/decorators/has.roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Books')
@Controller('books')
@UseGuards(ThrottlerGuard, RolesGuard) //Applying Rate Limiting And RolesGuard
export class BooksController {
  constructor(private booksService: BooksService) { }

  /**
   * Find all books
   * */
  @ApiOperation({
    summary: 'Find all books - Public Access',
    description: `Find all books`,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error'})
  @ApiResponse({ status: 404, description: 'NOT_FOUND - There is no books saved'})
  @Public()
  @Get()
  findAll(): Promise<BookDto[]> {
    return this.booksService.findAll();
  }

  /**
   * Find book by id
   * */
  @ApiOperation({
    summary: 'Find book by id - Public Access',
    description: `Find book by id`,
  })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - There is not book with id xxx'})
  @ApiResponse({ status: 400, description: 'Validation failed (numeric string is expected)' })
  @ApiResponse({ status: 500, description: 'Internal Server Error'})
  @Public()
  @Get(':bookId')
  findBook(@Param('bookId', ParseIntPipe) bookId: string): Promise<BookDto> {
    return this.booksService.findBookById(bookId);
  }

  /**
   * Find books by title
   * */
  @ApiOperation({
    summary: 'Find books by title - Public Access',
    description: `Find one or more coincidences.`,
  })
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
  @ApiOperation({
    summary: 'Create new book - ADMIN Access',
    description: `
    Rules:
    1 - Title required (string).\n
    2 - Genre required (string).\n
    3 - Author required(string).\n
    `,
  })
  @ApiResponse({ status: 400, description: 'title should not be empty.' })
  @ApiResponse({ status: 400, description: 'title must be a string.' })
  @ApiResponse({ status: 400, description: 'Genre should not be empty.' })
  @ApiResponse({ status: 400, description: 'Genre must be a string.' })
  @ApiResponse({ status: 400, description: 'Author should not be empty.' })
  @ApiResponse({ status: 400, description: 'Author must be a string.' })
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @ApiResponse({ status: 403, description: 'Forbidden resource'})
  @ApiResponse({ status: 500, description: 'Internal Server Error'})
  @ApiBearerAuth()
  @HasRoles('ADMIN')
  @Post()
  createBook(@Body() newBook: CreateBookDto): Promise<BookDto> {
    return this.booksService.createBook(newBook);
  }

  /**
   * Delete book
   * */
  @ApiOperation({
    summary: 'Delete book - ADMIN Access',
    description: `
    ##Warning##
    When book is deleted, book reservations will be deleted to!`,
  })
  @ApiResponse({ status: 200, description: 'The book with id xxx was deleted'})
  @ApiResponse({ status: 400, description: 'Validation failed (numeric string is expected)' })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - There is not book with id xxx'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @ApiResponse({ status: 403, description: 'Forbidden resource'})
  @ApiResponse({ status: 500, description: 'Internal Server Error'})
  @ApiBearerAuth()
  @HasRoles('ADMIN')
  @Delete(':bookId')
  deleteBook(@Param('bookId', ParseIntPipe) bookId: string): Promise<any> {
    return this.booksService.deleteBook(bookId);
  }

  /**
   * Update book
   * */
  @ApiOperation({
    summary: 'Update book - ADMIN Access',
  })
  @ApiResponse({ status: 200, description: 'The book with id xxx was updated'})
  @ApiResponse({ status: 400, description: 'Bad request, incorrect data'})
  @ApiResponse({ status: 400, description: 'Validation failed (numeric string is expected)' })
  @ApiResponse({ status: 404, description: 'NOT_FOUND - There is not book with id xxx'})
  @ApiResponse({ status: 403, description: 'Unauthorized'})
  @ApiResponse({ status: 403, description: 'Forbidden resource'})
  @ApiResponse({ status: 500, description: 'Internal Server Error'})
  @ApiBearerAuth()
  @HasRoles('ADMIN')
  @Put(':bookId')
  updateBook(
    @Param('bookId', ParseIntPipe) bookId: string,
    @Body() newBook: UpdateBookDto): Promise<any> {
    return this.booksService.updateBook(bookId, newBook);
  }
}

