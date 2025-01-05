import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Order, PaginationOptionsDto } from 'src/common/dtos/page-options.dto';
import { BookGetResponseDto } from './dto/books.dto';
import { Book } from 'src/entities';
import { NotFoundException } from '@nestjs/common';
import { BookDetailResponseDto } from './dto/books.dto';
import { BookIDDto } from './dto/books.dto';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  describe('findAll', () => {
    it('should return a list of books with pagination and categories', async () => {
      const paginationOption = {
        page: 1,
        take: 10,
        order: Order.ASC,
      } as PaginationOptionsDto;
      const books = [
        { id: 1, title: 'Book 1', category: { name: 'Category 1' } },
        { id: 2, title: 'Book 2', category: { name: 'Category 1' } },
        { id: 3, title: 'Book 3', category: { name: 'Category 2' } },
      ] as Book[];
      const count = 3;

      jest.spyOn(service, 'findAll').mockResolvedValueOnce([books, count]);

      const result: BookGetResponseDto =
        await controller.findAll(paginationOption);

      expect(result).toEqual({
        items: books,
        categories: [
          { name: 'Category 1', count: 2 },
          { name: 'Category 2', count: 1 },
        ],
        meta: {
          itemCount: books.length,
          currentPage: paginationOption.page,
          itemsPerPage: paginationOption.take,
          totalItems: count,
          totalPages: Math.ceil(count / paginationOption.take),
        },
      });
    });

    describe('findOne', () => {
      it('should return a book detail if found', async () => {
        const id = 1;
        const book = {
          id,
          title: 'Book 1',
          category: { name: 'Category 1' },
        } as unknown as BookDetailResponseDto;

        jest.spyOn(service, 'findOne').mockResolvedValueOnce(book);

        const result = await controller.findOne({ id });

        expect(result).toEqual(book);
      });

      it('should throw NotFoundException if book is not found', async () => {
        const id = 1;

        jest.spyOn(service, 'findOne').mockResolvedValueOnce(null as never);

        await expect(controller.findOne({ id })).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });
});
