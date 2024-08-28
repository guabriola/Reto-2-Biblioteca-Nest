import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.class';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let booksRepository: jest.Mocked<Repository<Book>>;

  const mockBook: Book = {
    id: 1,
    title: 'Test Book',
    genre: 'Fiction',
    description: 'A test book description',
    author: 'Author Name',
    publisher: 'Publisher Name',
    pages: 200,
    image_url: 'http://example.com/image.jpg',
    // bookReservations: [],
  };

  const mockCreateBookDto: CreateBookDto = {
    title: 'New Book',
    genre: 'Fiction',
    description: 'New book description',
    author: 'New Author',
    publisher: 'New Publisher',
    pages: 300,
    image_url: 'http://example.com/newimage.jpg',
  };

  const mockUpdateBookDto = new UpdateBookDto();
  mockUpdateBookDto.title = 'Updated Book'

  // Mock completo para createQueryBuilder
  const mockCreateQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockCreateQueryBuilder),

          },
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    booksRepository = module.get(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Tests for createBook
  describe('createBook', () => {
    it('should create and save a new book', async () => {
      booksRepository.save.mockResolvedValue(mockBook);

      const result = await service.createBook(mockCreateBookDto);
      expect(result).toEqual(mockBook);
      expect(booksRepository.save).toHaveBeenCalledWith(mockCreateBookDto);
    });
  });

  // Tests for findAll
  describe('findAll', () => {
    it('should return an array of books', async () => {
      booksRepository.find.mockResolvedValue([mockBook]);

      const result = await service.findAll();
      expect(result).toEqual([mockBook]);
      expect(booksRepository.find).toHaveBeenCalledWith();
    });

    it('should throw NotFoundException if no books are found', async () => {
      booksRepository.find.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(
        new HttpException({
          error: `NOT_FOUND - There is no books saved`,
        }, HttpStatus.NOT_FOUND)
      );
      expect(booksRepository.find).toHaveBeenCalledWith();
    });
  });

  // Tests for findBookById
  describe('findBookById', () => {
    it('should find and return a book by ID', async () => {
      booksRepository.findOne.mockResolvedValue(mockBook);

      const result = await service.findBookById('1');
      expect(result).toEqual(mockBook);
      expect(booksRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if the book is not found by ID', async () => {
      booksRepository.findOne.mockResolvedValue(null);

      await expect(service.findBookById('999')).rejects.toThrow(
        new HttpException({
          error: `NOT_FOUND - There is not book with id 999`,
        }, HttpStatus.NOT_FOUND)
      );
      expect(booksRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  // Tests for findBookByTitle
  describe('findBookByTitle', () => {
    it('should find and return books by title', async () => {
      mockCreateQueryBuilder.getMany.mockResolvedValue([mockBook]);

      const result = await service.findBookByTitle('Test');
      expect(result).toEqual([mockBook]);
      expect(booksRepository.createQueryBuilder).toHaveBeenCalledWith('bookSearch');
      expect(mockCreateQueryBuilder.where).toHaveBeenCalledWith(
        'bookSearch.title LIKE :title',
        { title: `%Test%` }
      );
      expect(mockCreateQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no books are found by title', async () => {
      mockCreateQueryBuilder.getMany.mockResolvedValue([]);

      await expect(service.findBookByTitle('Nonexistent')).rejects.toThrow(
        new NotFoundException(`There is no book with title nonexistent.`)
      );
      expect(booksRepository.createQueryBuilder).toHaveBeenCalledWith('bookSearch');
      expect(mockCreateQueryBuilder.where).toHaveBeenCalledWith(
        'bookSearch.title LIKE :title',
        { title: `%Nonexistent%` }
      );
      expect(mockCreateQueryBuilder.getMany).toHaveBeenCalled();
    });
  });


  // Tests for deleteBook
  describe('deleteBook', () => {
    it('should delete a book successfully', async () => {
      booksRepository.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await service.deleteBook('1');
      expect(result).toEqual(`The book with id 1 was deleted`);
      expect(booksRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if the book is not found for deletion', async () => {
      booksRepository.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await service.deleteBook('999');
      expect(result).toEqual(
        new HttpException({
          error: `NOT_FOUND - There is not book with id 999`,
        }, HttpStatus.NOT_FOUND)
      );
      expect(booksRepository.delete).toHaveBeenCalledWith({ id: 999 });
    });

    it('should throw HttpException if delete operation fails', async () => {
      booksRepository.delete.mockRejectedValue(new Error('Delete failed'));

      const result = await service.deleteBook('1');
      expect(result).toEqual(
        new HttpException({
          error: `Can't delete - Try later`,
        }, HttpStatus.NOT_MODIFIED)
      );
    });
  });

  // Tests for updateBook
  describe('updateBook', () => {
    it('should update a book successfully', async () => {
      booksRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.updateBook('1', mockUpdateBookDto);
      expect(result).toEqual(`The book with id 1 was updated`);
      expect(booksRepository.update).toHaveBeenCalledWith('1', mockUpdateBookDto);
    });

    it('should throw NotFoundException if the book is not found for update', async () => {
      booksRepository.update.mockResolvedValue({ affected: 0 } as any);

      const result = await service.updateBook('999', mockUpdateBookDto);
      expect(result).toEqual(
        new HttpException({
          error: `NOT_FOUND - There is not book with id 999`,
        }, HttpStatus.NOT_FOUND)
      );
      expect(booksRepository.update).toHaveBeenCalledWith('999', mockUpdateBookDto);
    });

    it('should throw HttpException if update operation fails', async () => {
      booksRepository.update.mockRejectedValue(new Error('Update failed'));

      const result = await service.updateBook('1', mockUpdateBookDto);
      expect(result).toEqual(
        new HttpException({
          error: `Bad request, incorrect data: Error: Update failed`,
        }, HttpStatus.BAD_REQUEST)
      );
    });
  });
});