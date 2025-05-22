import { ObjectSchema } from './utils/object'
import { StringSchema } from './utils/string'
import type { SchemaType } from '../types/schema'

export const LoginRequestSchema = new ObjectSchema({
  username: new StringSchema('Username').getSchema(),
  password: new StringSchema('Password')
    .getSchema()
}).getSchema()

export type LoginRequest = SchemaType<typeof LoginRequestSchema>