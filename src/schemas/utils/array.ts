import { i18n } from '@/i18n/i18n';
import type { Composer } from 'vue-i18n';
import { z } from 'zod';

export class ArraySchema<T extends z.ZodTypeAny> {
  #schema!: z.ZodArray<T> | z.ZodArray<T, 'atleastone'>;
  #field: string;
  #i18n: Composer

  constructor(field: string, elements: T) {
    this.#field = field;
    this.#i18n = i18n.global as Composer;
    this.#schema = z.array(elements, {
      invalid_type_error: this.#i18n.t('validation.array', { field }),
      required_error: this.#i18n.t('validation.required', { field }),
    })
  }

  getSchema(): z.ZodArray<T> | z.ZodArray<T, 'atleastone'> {
    return this.#schema;
  }

  nonempty() {
    this.#schema = this.#schema.nonempty(this.#i18n.t('validation.nonempty', { field: this.#field }))
    return this;
  }
}
