import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { BookDto } from './dto/book.dto';
import { Book } from './book.class';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository, UpdateResult } from 'typeorm';
import { UpdateBookDto } from './dto/updateBook.dto';


@Injectable()
export class BooksService {

    constructor(
      @InjectRepository(Book) private booksRepository: Repository<Book>, 
    ) {}

    async findAll(params): Promise<Book[]> { 
      try{
      return await this.booksRepository.find(); 
      }catch (e){
        throw e;
      }
    }
  
    async findBook(bookId: string): Promise<Book> {
      try{
        return await this.booksRepository.findOne({ where: { id: parseInt(bookId)  } }); 
      }catch (e){
        throw e;
      }
    }
  
    createBook(newBook: BookDto): Promise<Book> {
      
      try{
        return this.booksRepository.save(newBook);
      }catch (e){
        throw e;
      }
    }
  
    async deleteBook(bookId: string): Promise<any> {
      
      try{
        const response = await this.booksRepository.delete({ id: parseInt(bookId) });
        if(response.affected = 0){
          return
        }
      }catch (e){
        return `Can't delete, the book it is booked`;
        // throw new Error('The book it is booked');
      }
    }
  
    async updateBook(bookId: string, newBook: UpdateBookDto): Promise<UpdateResult> { 

      
      try{
        return this.booksRepository.update(bookId, newBook);
      }catch (e){
        throw e;
      }

      //This is another way to doit - Check userUpdate in userService
      // let toUpdate = await this.booksRepository.findOne({ where: { id: parseInt(bookId)  } }); 
      // let updated = Object.assign(toUpdate, newBook); 
      // return this.booksRepository.save(updated); 
    }

}
