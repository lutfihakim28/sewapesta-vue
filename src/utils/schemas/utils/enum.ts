import { validationMessages } from '@/utils/constants/validation-message';
import { z } from 'zod';

export class EnumSchema<T extends z.EnumLike> {
  #schema!: z.ZodNativeEnum<T>

  constructor(field: string, nativeEnum: T) {
    this.#schema = z.nativeEnum(nativeEnum, {
      invalid_type_error: validationMessages.enum(field, nativeEnum),
      required_error: validationMessages.required(field),
    })
  }

  getSchema() {
    return this.#schema;
  }
}