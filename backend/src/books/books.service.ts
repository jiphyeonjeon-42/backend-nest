import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book, BookCopy } from '../entities';
import { PaginationOptionsDto } from '../common/dtos/page-options.dto';
import {
  CreateBookCopyRequestDto,
  CreateBookCopyResponseDto,
  BookCopySearchResponseDto,
  UpdateBookRequestDto,
  BookDetailResponseDto,
  BookDto,
} from './dto/books.dto';
import { BOOK_STATUS, getStatusString } from './constants';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookCopy)
    private readonly bookCopyRepository: Repository<BookCopy>,
  ) {}

  async findAll(options: PaginationOptionsDto): Promise<[Book[], number]> {
    return this.bookRepository.findAndCount({
      take: options.take,
      skip: (options.page - 1) * options.take,
      order: { createdAt: options.order },
      relations: ['category'],
    });
  }

  private mapBookCopyToDto(copy: BookCopy) {
    if (!copy.id) {
      throw new Error('Book copy ID is required');
    }
    return {
      id: copy.id,
      callSign: copy.callSign,
      donator: copy.donator,
      status: getStatusString(copy.status),
      dueDate: copy.lendings?.[0]?.returnedAt || null,
      isLendable: copy.status === BOOK_STATUS.OK,
      isReserved: Boolean(copy.reservations?.length),
    };
  }

  async findOne(id: number): Promise<BookDetailResponseDto> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['category', 'books', 'books.lendings', 'books.reservations'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const bookCopies = (book.books || []).map((x) => this.mapBookCopyToDto(x));

    return {
      book,
      bookCopies,
    };
  }

  async createCopy(
    id: number,
    createBookCopyDto: CreateBookCopyRequestDto,
  ): Promise<CreateBookCopyResponseDto> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const bookCopy = this.bookCopyRepository.create({
      info: book,
      callSign: createBookCopyDto.callSign,
      donator: createBookCopyDto.donator || null,
      status: BOOK_STATUS.OK,
    });

    const savedCopy = await this.bookCopyRepository.save(bookCopy);

    return {
      book,
      bookCopy: this.mapBookCopyToDto(savedCopy),
    };
  }

  async findCopies(id: number): Promise<BookCopySearchResponseDto> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['books', 'books.lendings', 'books.reservations'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    const bookCopies = (book.books || []).map(this.mapBookCopyToDto.bind(this));

    return {
      items: bookCopies,
      meta: {
        itemCount: bookCopies.length,
        currentPage: 1,
        itemsPerPage: bookCopies.length,
        totalItems: bookCopies.length,
        totalPages: 1,
      },
    };
  }

  async update(
    id: number,
    updateBookDto: UpdateBookRequestDto,
  ): Promise<BookDto> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    Object.assign(book, updateBookDto);
    return this.bookRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }
}
