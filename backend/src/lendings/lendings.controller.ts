import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiCreatedResponse,
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
} from 'src/dto';

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
}
