import { z } from 'zod';

export const BaseResponseSchema = z.object({
  code: z.number(),
  messages: z.string(),
})

export type BaseResponse = z.infer<typeof BaseResponseSchema>