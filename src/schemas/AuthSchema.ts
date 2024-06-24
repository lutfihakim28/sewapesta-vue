import { validationMessages } from '@/constants/validationMessages';
import { z } from 'zod';
import { BaseResponseSchema } from './BaseResponseSchema';

export const LoginRequestSchema = z.object({
  username: z.string({ message: validationMessages.required('Nama Pengguna') }),
  password: z
    .string({ message: validationMessages.required('Kata Sandi') })
    .min(8, { message: validationMessages.minLength('Kata Sandi', 8) })
})

export const LoginResponseSchema = BaseResponseSchema.extend({
  data: z.object({
    token: z.string(),
    user: z.object({
      id: z.number(),
      username: z.string()
    })
  })
})

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>