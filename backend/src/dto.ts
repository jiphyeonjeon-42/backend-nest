import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const intSchema = z.number().int();
export const bookIdSchema = intSchema.describe('도서 ID');
export const userIdSchema = intSchema.describe('회원 ID');
export const positiveSchema = intSchema
  .positive()
  .describe('0보다 큰 양의 정수');
export const limitSchema = extendApi(
  positiveSchema.describe('한 페이지당 보여줄 결과물의 개수'),
  { example: 3 },
);
