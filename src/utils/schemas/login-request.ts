import type { z } from 'zod'
import { ObjectSchema } from './utils/object'
import { StringSchema } from './utils/string'

export const LoginRequestSchema = new ObjectSchema({
  username: new StringSchema('Username').getSchema(),
  password: new StringSchema('Password')
    .getSchema()
}).getSchema()

export type LoginRequest = z.output<typeof LoginRequestSchema>