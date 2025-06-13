import { z } from 'zod';

export class ObjectSchema<T extends z.ZodRawShape> {
  #schema!: z.ZodObject<T>

  constructor(shape: T) {
    this.#schema = z.object(shape)
  }

  getSchema(): z.ZodObject<T> {
    return this.#schema;
  }
}