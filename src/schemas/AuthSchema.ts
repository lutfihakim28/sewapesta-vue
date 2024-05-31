import { z } from 'zod';
import { UserResponseSchema } from './UserSchema';
import { validationMessages } from '@/constants/validationMessages';
import { ResponseSchema } from './ResponseSchema';

export const LoginRequestSchema = z.object({
  username: z.string({
    message: validationMessages.required('Nama pengguna')
  }),
  password: z.string({
    message: validationMessages.required('Kata sandi')
  }).min(8, validationMessages.minLength('Kata sandi', 8))
})

export const LoginResponseSchema = ResponseSchema.merge(z.object({
  data: z.object({
    token: z.string(),
    user: UserResponseSchema
  })
}));

export const LogoutResponseSchema = ResponseSchema;

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>