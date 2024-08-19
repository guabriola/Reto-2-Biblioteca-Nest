import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { ThrottlerGuard } from '@nestjs/throttler';
import { BooksService } from './books.service';
import { BookDto } from './dto/book.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Book } from './book.class';
import { CreateBookDto } from './dto/createBook.dto';

describe('BooksController', () => {
  let controller: BooksController;
  let booksService: BooksService;

  //BookDto Mock
  const bookDto: BookDto =
  {
    "id": 3,
    "title": "El enigma de la habitación 622",
    "genre": "Ficción contemporánea",
    "description": "Descripcion del libro",
    "author": "Joël Dicker",
    "publisher": "Alfaguara",
    "pages": 624,
    "image_url": "https://imageURL.jpg"
  };

  //Book Mock
  const book: Book =
  {
    "id": 3,
    "title": "El enigma de la habitación 622",
    "genre": "Ficción contemporánea",
    "description": "Descripcion del libro",
    "author": "Joël Dicker",
    "publisher": "Alfaguara",
    "pages": 624,
    "image_url": "https://imageURL.jpg"
  };

  //CreateBookDto Mock
  const createBookDto: CreateBookDto =
  {
    "title": "El enigma de la habitación 622",
    "genre": "Ficción contemporánea",
    "description": "Descripcion del libro",
    "author": "Joël Dicker",
    "publisher": "Alfaguara",
    "pages": 624,
    "image_url": "https://imageURL.jpg"
  };

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          //Moking books service
          provide: BooksService,
          useValue: {
            createBook: jest.fn(),
            findAll: jest.fn(),
            findBookById: jest.fn(),
            findBookByTitle: jest.fn(),
            deleteBook: jest.fn(),
            updateBook: jest.fn(),
          }
        }
      ]
    })
      //Override ThrottleGuard.
      .overrideGuard(ThrottlerGuard)
      //Moking the response of the guard.
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<BooksController>(BooksController);
    booksService = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //Find all Books
  describe('Find all books', () => {

    it('Should find all boooks', async () => {
      jest.spyOn(booksService, 'findAll').mockResolvedValue([bookDto]);
      const result = await controller.findAll();
      expect(result).toEqual([bookDto]);
      expect(booksService.findAll).toHaveBeenLastCalledWith();
    })

    //Not Found
    it('Should throw NotFoundException if there are not books', async () => {
      jest.spyOn(booksService, 'findAll').mockRejectedValue(new NotFoundException());
      await expect(controller.findAll()).rejects.toThrow(NotFoundException);
      expect(booksService.findAll).toHaveBeenCalledWith();
    })
  })

  //Find book by id
  describe('Find book by id', () => {

    it('Should find a book by the id', async () => {
      const bookId = '1';
      jest.spyOn(booksService, 'findBookById').mockResolvedValue(bookDto);
      const result = await controller.findBook(bookId);
      expect(result).toEqual(bookDto);
      expect(booksService.findBookById).toHaveBeenLastCalledWith(bookId);
    })

    //User not found
    it('Shold throw NotFoundException if there is not user', async () => {
      const bookId = '1';
      jest.spyOn(booksService, 'findBookById').mockRejectedValue(new NotFoundException());
      await expect(controller.findBook(bookId)).rejects.toThrow(NotFoundException);
      expect(booksService.findBookById).toHaveBeenLastCalledWith(bookId);
    })

    //User id not a string number
    it('Should throw BadRequestException when id is not number string', async () => {
      const bookId = '1';
      jest.spyOn(booksService, 'findBookById').mockRejectedValue(new BadRequestException());
      await expect(controller.findBook(bookId)).rejects.toThrow(BadRequestException);
      expect(booksService.findBookById).toHaveBeenLastCalledWith(bookId);
    })

  })

  //Find books by title
  describe('Find books by title', () => {

    it('Should find books that match the title', async () => {
      const title = 'title';
      jest.spyOn(booksService, 'findBookByTitle').mockResolvedValue([bookDto]);
      const result = await controller.findBookByTitle(title);
      expect(result).toEqual([bookDto]);
      expect(booksService.findBookByTitle).toHaveBeenLastCalledWith(title);
    })

    it('Should throw NotFouncException if there is not a books matching title', async () => {
      const title = 'title';
      jest.spyOn(booksService, 'findBookByTitle').mockRejectedValue(new NotFoundException());
      await expect(controller.findBookByTitle(title)).rejects.toThrow(NotFoundException);
      expect(booksService.findBookByTitle).toHaveBeenLastCalledWith(title);
    })
  })

  //Create new Book
  describe('Create new book', () => {

    it('Should create a new book', async () => {
      jest.spyOn(booksService, 'createBook').mockResolvedValue(book);
      const result = await controller.createBook(createBookDto);
      expect(result).toEqual(book);
      expect(booksService.createBook).toHaveBeenLastCalledWith(createBookDto);
    })

    
  })
});
