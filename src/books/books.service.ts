import { Injectable } from '@nestjs/common';
import { retry } from 'rxjs';

@Injectable()
export class BooksService {

    findAll(params): any {
        let msg = `findAll Working with params:`;

        if (params.order !== undefined) {
        msg = msg + ` order: ${params.order}`;
        }

        if (params.limit !== undefined) {
        msg = msg + ` limit: ${params.limit}`;
        }

        return msg;
    }

    findBook(bookId : string){
        return `findBook It's working - Here is the book with id: ${bookId}!`;
    }   
    
    createBook(newBook: any){
        return newBook;
    }

    deleteBook(bookId : string){
        return `Book with id ${bookId} is deleted`;
    }

    updateBook(bookId: string, newBook : any){
        return newBook;
    }

}
