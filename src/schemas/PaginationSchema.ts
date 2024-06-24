import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1'),
  limit: z
    .string()
    .optional()
    .default('10'),
})