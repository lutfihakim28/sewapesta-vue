import { i18n } from '@/i18n';
import type { Composer } from 'vue-i18n';
import { z } from 'zod';

export class BooleanSchema {
  #schema!: z.ZodBoolean | z.ZodEffects<z.ZodBoolean, boolean, unknown>;
  #field!: string
  #i18n: Composer

  constructor(field: string) {
    this.#field = field;
    this.#i18n = i18n.global as Composer
  }

  getSchema() {
    this.#schema = z.boolean({
      invalid_type_error: this.#i18n.t('validation.boolean', { field: this.#field }),
      required_error: this.#i18n.t('validation.required', { field: this.#field })
    })
    return this.#schema;
  }

  getQuerySchema() {
    this.#schema = z.preprocess((value) => {
      if (value === 'true' || value === '1') return true
      if (value === 'false' || value === '0' || value === '') return false
      return value
    }, z.boolean({
      invalid_type_error: this.#i18n.t('validation.boolean', { field: this.#field }),
    }))
    return this.#schema
  }
}
