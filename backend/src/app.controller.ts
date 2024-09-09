import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello/:name')
  @ApiOperation({
    summary: '인사말을 반환합니다.',
    description: '이름을 입력하면 그 이름을 포함한 인사말을 반환합니다.',
  })
  @ApiParam({ name: 'name', description: '이름', example: 'Nest' })
  @ApiResponse({ status: 200, description: '성공', example: 'Hello Nest!' })
  getHelloWithName(@Param('name') name: string): string {
    return this.appService.getHello(name);
  }
}
