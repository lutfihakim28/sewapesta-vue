import { z } from 'zod'

export const ResponseSchema = z.object({
  code: z.number(),
  messages: z.string().array(),
})