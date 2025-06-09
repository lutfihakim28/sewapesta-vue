import { i18n } from '@/i18n/i18n';
import type { Composer } from 'vue-i18n';
import { z } from 'zod';

export class NumberSchema {
  #schema!: z.ZodNumber
  #field!: string
  #i18n: Composer;

  constructor(field: string) {
    this.#i18n = i18n.global as Composer
    this.#schema = z.number({
      invalid_type_error: this.#i18n.t('validation.number', { field }),
      required_error: this.#i18n.t('validation.required', { field })
    })
    this.#field = field;
  }

  getSchema() {
    return this.#schema;
  }

  positive() {
    this.#schema = this.#schema.positive({
      message: this.#i18n.t('validation.positive-number', { field: this.#field })
    })
    return this;
  }

  nonnegative() {
    this.#schema = this.#schema.positive({
      message: this.#i18n.t('validation.nonNegative-number', { field: this.#field })
    })
    return this;
  }

  integer() {
    this.#schema = this.#schema.int({
      message: this.#i18n.t('validation.integer', { field: this.#field })
    })
    return this;
  }

  natural() {
    return this.integer().positive();
  }

  whole() {
    return this.integer().nonnegative();
  }
}
