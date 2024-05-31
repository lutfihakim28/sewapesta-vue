import { z } from 'zod'

export const UserResponseSchema = z
  .object({
    id: z.number(),
    username: z.string(),
    accountId: z.number(),
  })