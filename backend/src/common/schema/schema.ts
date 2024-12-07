import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const findOneSchema = z.coerce.number().int().min(0);

export const paginationRequestSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(10).default(10),
});

/**
 * @description pagination meta schema
 *
 * @current_page current page
 * @limit number of items per page
 * @total total number of items
 * @total_pages total number of pages
 * @next next page number
 * @prev previous page number
 */
export const paginationMetaSchema = z.object({
  limit: z.coerce.number().int().min(1),
  total: z.coerce.number().int().min(0),
  current_page: z.coerce.number().int().min(1),
  total_pages: z.coerce.number().int().min(1),
  next: z.coerce.number().int().min(1).nullable(),
  prev: z.coerce.number().int().min(1).nullable(),
});
