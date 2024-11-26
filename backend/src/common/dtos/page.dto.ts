import { z } from 'zod';
import { extendApi } from '@anatine/zod-openapi';
import { MetaDto, metaSchema } from './meta.dto';

export const createPageSchema = <T extends z.ZodType>(itemSchema: T) => z.object({
  items: extendApi(z.array(itemSchema), {
    description: '페이지 항목 배열'
  }),
  meta: extendApi(metaSchema, {
    description: '페이지 메타데이터'
  }),
});

export type PageType<T> = {
  items: T[];
  meta: MetaDto;
};
