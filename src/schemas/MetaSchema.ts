import { z } from 'zod';

export const MetaSchema = z.object({
  meta: z.object({
    page: z.number().positive(),
    limit: z.number().positive(),
    totalPage: z.number().positive(),
    totalData: z.number().positive(),
  }),
})