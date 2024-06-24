import { z } from 'zod';

export const MetaSchema = z.object({
  page: z.number().positive(),
  limit: z.string(),
  totalPage: z.number().positive(),
})

export type Meta = z.infer<typeof MetaSchema>