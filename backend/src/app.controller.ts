import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';

const helloWithNameSchema = z.object({
  name: extendApi(z.string(), { example: 'Nest' }),
});
class HelloWithNameDto extends createZodDto(helloWithNameSchema) {}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello('World');
  }

  @Get('hello/:name')
  @ApiOperation({
    summary: '인사말을 반환합니다.',
    description: '이름을 입력하면 그 이름을 포함한 인사말을 반환합니다.',
  })
  @ApiResponse({ status: 200, description: '성공', example: 'Hello Nest!' })
  getHelloWithName(@Param() { name }: HelloWithNameDto): string {
    return this.appService.getHello(name);
  }
}
