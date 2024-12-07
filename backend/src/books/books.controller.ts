import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { BooksService } from './books.service';
import {
  BookDto,
  BookGetResponseDto,
  BookDetailResponseDto,
  CreateBookCopyRequestDto,
  CreateBookCopyResponseDto,
  BookCopySearchResponseDto,
  UpdateBookRequestDto,
} from './dto/books.dto';
import { PaginationOptionsDto } from 'src/common/dtos/page-options.dto';

@ApiTags('books')
@Controller('books')
@UsePipes(ZodValidationPipe)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: '도서 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '도서 목록 조회 성공',
    type: BookGetResponseDto,
  })
  async findAll(
    @Query() paginationOption: PaginationOptionsDto,
  ): Promise<BookGetResponseDto> {
    const [items, count] = await this.booksService.findAll(paginationOption);
    const categories = Object.entries(
      Object.groupBy(
        items.map((item) => item.category),
        (x) => x.name,
      ),
    )
      .map(([name, count]) => ({ name, count: count?.length ?? 0 }))
      .filter((item) => item.count > 0);

    return {
      items,
      categories,
      meta: {
        itemCount: items.length,
        currentPage: paginationOption.page,
        itemsPerPage: paginationOption.take,
        totalItems: count,
        totalPages: Math.ceil(count / paginationOption.take),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '도서 상세 정보 조회' })
  @ApiParam({ name: 'id', description: '도서 ID' })
  @ApiResponse({
    status: 200,
    description: '도서 상세 정보 조회 성공',
    type: BookDetailResponseDto,
  })
  async findOne(@Param('id') id: number): Promise<BookDetailResponseDto> {
    const book = await this.booksService.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  @Post(':id/book-copies')
  @ApiOperation({ summary: '도서 복본 생성' })
  @ApiParam({ name: 'id', description: '도서 ID' })
  @ApiBody({ type: CreateBookCopyRequestDto })
  @ApiResponse({
    status: 201,
    description: '도서 복본 생성 성공',
    type: CreateBookCopyResponseDto,
  })
  async createCopy(
    @Param('id') id: number,
    @Body() createBookCopyDto: CreateBookCopyRequestDto,
  ): Promise<CreateBookCopyResponseDto> {
    return this.booksService.createCopy(id, createBookCopyDto);
  }

  @Get(':id/book-copies')
  @ApiOperation({ summary: '도서 복본 목록 조회' })
  @ApiParam({ name: 'id', description: '도서 ID' })
  @ApiResponse({
    status: 200,
    description: '도서 복본 목록 조회 성공',
    type: BookCopySearchResponseDto,
  })
  async findCopies(
    @Param('id') id: number,
  ): Promise<BookCopySearchResponseDto> {
    return this.booksService.findCopies(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '도서 정보 수정' })
  @ApiParam({ name: 'id', description: '도서 ID' })
  @ApiBody({ type: UpdateBookRequestDto })
  @ApiResponse({
    status: 200,
    description: '도서 정보 수정 성공',
    type: BookDto,
  })
  async update(
    @Param('id') id: number,
    @Body() updateBookDto: UpdateBookRequestDto,
  ): Promise<BookDto> {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '도서 삭제' })
  @ApiParam({ name: 'id', description: '도서 ID' })
  @ApiResponse({
    status: 204,
    description: '도서 삭제 성공',
  })
  async remove(@Param('id') id: number): Promise<void> {
    await this.booksService.remove(id);
  }
}
