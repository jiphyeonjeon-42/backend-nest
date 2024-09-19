import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import {
  bookIdSchema,
  userIdSchema,
  intSchema,
  limitSchema,
  positiveSchema,
} from 'src/dto'

const lendingIdSchema = intSchema.describe('대출 기록 고유 ID');
const conditionSchema = extendApi(z.string().describe('도서 상태'), {
  example: '이상 없음',
});

const createLendingsSchema = z.object({
  bookId: bookIdSchema,
  userId: userIdSchema,
  condition: conditionSchema,
});
class CreateLendingsDto extends createZodDto(createLendingsSchema) {}

const createLendingsResponseSchema = z.object({
  dueDate: z.date().describe('생성된 대출기록의 반납 예정일자'),
});
class CreateLendingsResponseDto extends createZodDto(
  createLendingsResponseSchema,
) {}

const searchLendingsSchema = z.object({
  page: positiveSchema.default(1).optional().describe('검색 결과의 페이지'),
  limit: limitSchema.default(5).optional(),
  sort: z
    .enum(['new', 'old'])
    .default('new')
    .optional()
    .describe('검색 결과를 정렬할 기준'),
  query: extendApi(
    z.string().optional().describe('대출 기록에서 검색할 단어'),
    { example: '파이썬' },
  ),
  type: z
    .enum(['user', 'title', 'callSign', 'bookId'])
    .optional()
    .describe('query로 조회할 항목'),
});
class SearchLendingsDto extends createZodDto(searchLendingsSchema) {}

const searchLendingSchema = z.object({
  lendingId: lendingIdSchema,
});
class SearchLendingDto extends createZodDto(searchLendingSchema) {}

const returnLendingSchema = z.object({
  condition: conditionSchema,
});
class ReturnLendingDto extends createZodDto(returnLendingSchema) {}
class LegacyReturnLendingDto extends createZodDto(
  searchLendingSchema.merge(returnLendingSchema),
) {}

@Controller('lendings')
@ApiTags('lendings')
export class LendingsController {
  constructor() {}

  @Post()
  @ApiOperation({
    summary: '대출 기록 생성',
    description: '대출 기록을 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '생성된 대출기록의 반납일자를 반환합니다.',
    type: CreateLendingsResponseDto,
  })
  async createLending(
    @Body() body: CreateLendingsDto,
  ): Promise<CreateLendingsResponseDto> {
    return { dueDate: new Date() };
  }

  @ApiOperation({ deprecated: true, summary: '대출 기록 정보 조회' })
  @Get('search')
  searchLendingsLegacy(@Query() query: SearchLendingsDto) {
    return this.searchLendings(query);
  }

  @Get()
  @ApiOperation({
    summary: '대출 기록 정보 조회',
    description: '대출 기록의 정보를 검색하여 보여줍니다.',
  })
  @ApiOkResponse({
    description: '대출 기록 정보를 반환합니다.',
  })
  searchLendings(@Query() query: SearchLendingsDto) {}

  @Get(':lendingId')
  @ApiOperation({
    summary: '특정 대출 기록 조회',
    description: '특정 대출 기록의 상세 정보를 보여줍니다.',
  })
  @ApiOkResponse({
    description: '대출 기록을 반환합니다.',
  })
  getLending(@Param() { lendingId }: SearchLendingDto) {}

  @Patch('return')
  @ApiOperation({ deprecated: true, summary: '반납 처리' })
  returnLendingLegacy(
    @Body() { lendingId, condition }: LegacyReturnLendingDto,
  ) {
    return this.returnLending({ lendingId }, { condition });
  }

  @Patch(':lendingId')
  @ApiOperation({
    summary: '반납 처리',
    description: '대출 레코드에 반납 처리를 합니다.',
  })
  @ApiOkResponse({
    description: '반납처리 완료, 반납된 책이 예약이 되어있는지 알려줍니다.',
  })
  returnLending(
    @Param() { lendingId }: SearchLendingDto,
    @Body() { condition }: ReturnLendingDto,
  ) {
    return { reservedBook: true };
  }
}
