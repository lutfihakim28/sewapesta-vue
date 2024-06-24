import { z } from 'zod';

export const DateRangeSchema = z.object({
  startAt: z.string().date(),
  endAt: z.string().date(),
}).partial()