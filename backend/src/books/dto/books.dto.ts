import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { createPageSchema } from 'src/common/dtos/page.dto';
import { metaSchema } from 'src/common/dtos/meta.dto';
import { intSchema } from 'src/dto';

const imageSchema = extendApi(z.string().url().nullable(), {
  description: '도서 표지 이미지 URL',
});

const isbnSchema = extendApi(z.string(), {
  description: '도서 ISBN',
  example: '9788065960874',
});

export const categoryCountSchema = z.object({
  name: extendApi(z.string(), { description: '카테고리 이름' }),
  count: extendApi(intSchema, { description: '카테고리 내 도서 수' }),
});

const bookSchema = z.object({
  id: extendApi(intSchema, { description: '도서 ID' }),
  title: extendApi(z.string(), { description: '도서 제목' }),
  author: extendApi(z.string(), { description: '저자' }),
  publisher: extendApi(z.string(), { description: '출판사' }),
  isbn: isbnSchema,
  image: imageSchema.nullable(),
  publishedAt: extendApi(z.date(), { description: '출판일' }).nullable(),
  createdAt: extendApi(z.date(), { description: '등록일' }),
  updatedAt: extendApi(z.date(), { description: '수정일' }),
});

const categorySchema = z.object({
  id: extendApi(intSchema, { description: '카테고리 ID' }),
  name: extendApi(z.string(), { description: '카테고리 이름' }),
});

const bookCopySchema = z.object({
  id: extendApi(intSchema, { description: '도서 복본 ID' }),
  callSign: extendApi(z.string(), { description: '청구기호' }),
  donator: extendApi(z.string().nullable(), { description: '기증자' }),
  status: extendApi(z.string(), { description: '도서 상태' }),
  dueDate: extendApi(z.date().nullable(), { description: '반납 예정일' }),
  isLendable: extendApi(z.boolean(), { description: '대출 가능 여부' }),
  isReserved: extendApi(z.boolean(), { description: '예약 여부' }),
});

const bookSearchResultSchema = z.object({
  book: bookSchema,
  category: categorySchema,
});

const bookGetResponseSchema = createPageSchema(bookSchema).extend({
  categories: z.array(categoryCountSchema),
});

const bookDetailResponseSchema = z.object({
  book: bookSchema,
  bookCopies: z.array(bookCopySchema),
});

const createBookCopyRequestSchema = z.object({
  isbn: isbnSchema,
  callSign: extendApi(z.string(), { description: '청구기호' }),
  donator: extendApi(z.string().optional(), { description: '기증자' }),
});

const createBookCopyResponseSchema = z.object({
  book: bookSchema,
  bookCopy: bookCopySchema,
});

const bookCopySearchResponseSchema = createPageSchema(bookCopySchema);

const updateBookRequestSchema = bookSchema.omit({ id: true });

export class CategoryCountDto extends createZodDto(categoryCountSchema) {}
export class BookDto extends createZodDto(bookSchema) {}
export class CategoryDto extends createZodDto(categorySchema) {}
export class BookCopyDto extends createZodDto(bookCopySchema) {}
export class BookIDDto extends createZodDto(bookSchema.pick({ id: true })) {}
export class BookSearchResultDto extends createZodDto(bookSearchResultSchema) {}
export class BookGetResponseDto extends createZodDto(bookGetResponseSchema) {}
export class BookDetailResponseDto extends createZodDto(
  bookDetailResponseSchema,
) {}
export class CreateBookCopyRequestDto extends createZodDto(
  createBookCopyRequestSchema,
) {}
export class CreateBookCopyResponseDto extends createZodDto(
  createBookCopyResponseSchema,
) {}
export class BookCopySearchResponseDto extends createZodDto(
  bookCopySearchResponseSchema,
) {}
export class UpdateBookRequestDto extends createZodDto(
  updateBookRequestSchema,
) {}
