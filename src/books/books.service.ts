import { Injectable, HttpStatus, HttpException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BookDto } from './dto/book.dto';
import { Book } from './book.class';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, UpdateResult } from 'typeorm';
import { UpdateBookDto } from './dto/updateBook.dto';
import { CreateBookDto } from './dto/createBook.dto';


@Injectable()
export class BooksService {

  constructor(
    @InjectRepository(Book) private booksRepository: Repository<Book>,
  ) { }

  //Create Book
  async createBook(newBook: CreateBookDto): Promise<BookDto> {

    try {
      return await this.booksRepository.save(newBook);
      
    } catch (e) {
      throw e
    }
  }

  //Find all books
  async findAll(params): Promise<Book[]> {
    try {
      const books = await this.booksRepository.find();
      if (books.length > 0) {
        return books;
      } else throw new HttpException({
        error: `NOT_FOUND - There is no books saved`
      }, HttpStatus.NOT_FOUND)
    } catch (e) {
      throw e;
    }
  }

  //Find a Book by Id
  async findBookById(bookId: string): Promise<Book> {

    try {
      const foundedBook = await this.booksRepository.findOne({ where: { id: parseInt(bookId) } });
      if (foundedBook) {
        return foundedBook;
      } else throw new HttpException({
        error: `NOT_FOUND - There is not book with id ${bookId}`
      }, HttpStatus.NOT_FOUND)

    } catch (e) {
      throw e;
    }

  }

  //Find a book by Title
  async findBookByTitle(title: string): Promise<BookDto[]> {
    try {

      const books = await this.booksRepository
        .createQueryBuilder('bookSearch')
        .where('bookSearch.title LIKE :title', { title: `%${title}%` })
        .getMany()

      if (books.length > 0) {
        return books;
      } else {
        throw new NotFoundException(`There is no book with title ${title.toLowerCase()}.`);
      }

    } catch (e) {
      throw e;
    }
  }

  //Delete Book
  async deleteBook(bookId: string): Promise<any> {

    try {
      const response = await this.booksRepository.delete({ id: parseInt(bookId) });

      if (response.affected != 1) {
        return new HttpException({
          error: `NOT_FOUND - There is not book with id ${bookId}`
        }, HttpStatus.NOT_FOUND)
      }

      if (response.affected == 1) {
        return `The book with id ${bookId} was deleted`;
      }

    } catch (e) {
      return new HttpException({
        error: `Can't delete - Try later`
      }, HttpStatus.NOT_MODIFIED)
    }
  }

  //Update Book
  async updateBook(bookId: string, newBook: UpdateBookDto): Promise<any> {

    try {
      const response = await this.booksRepository.update(bookId, newBook);

      if (response.affected != 1) {
        return new HttpException({
          error: `NOT_FOUND - There is not book with id ${bookId}`
        }, HttpStatus.NOT_FOUND)
      }

      if (response.affected == 1) {
        return `The book with id ${bookId} was updated`;
      }

    } catch (e) {
      return new HttpException({
        error: `Bad request, incorrect data: ${e}`
      }, HttpStatus.BAD_REQUEST)
    }

  }

}
