import { i18n } from '@/i18n/i18n';
import type { Composer } from 'vue-i18n';
import { z } from 'zod';

export class StringSchema {
  #schema!: z.ZodString
  #field!: string;
  #i18n: Composer;

  constructor(field: string) {
    this.#i18n = i18n.global as Composer
    this.#schema = z.string({
      invalid_type_error: this.#i18n.t('validation.string', { field }),
      required_error: this.#i18n.t('validation.required', { field })
    })
    this.#field = field;
  }

  getSchema() {
    return this.#schema;
  }

  neutralNumeric() {
    this.#schema = this.#schema.regex(/^[1-9]\d*$/, {
      message: this.#i18n.t('validation.numeric', { field: this.#field }),
    });
    return this;
  }

  phone() {
    this.#schema = this.#schema
      .regex(/^\d+(\.\d+)?$/, {
        message: this.#i18n.t('validation.numeric', { field: this.#field }),
      }).regex(/^628[1-9][0-9]{6,9}$/, {
        message: this.#i18n.t('validation.phone', { field: this.#field })
      })
    return this;
  }

  min(length: number) {
    this.#schema = this.#schema.min(length, {
      message: this.#i18n.t('validation.min-length', { field: this.#field, length })
    })
    return this;
  }

  length(length: number) {
    this.#schema = this.#schema.length(length, {
      message: this.#i18n.t('validation.length', { field: this.#field, length })
    })
    return this;
  }

  subdistrictCode() {
    this.#schema = this.#schema.regex(/^[1-9]{2}\.[0-9]{2}\.[0-9]{2}\.[1-9][0-9]{2}[1-9]$/, {
      message: this.#i18n.t('validation.location-code', { field: this.#field, format: 'xx.xx.xx.xxxx' })
    })
    return this;
  }

  districtCode() {
    this.#schema = this.#schema.regex(/^[1-9]{2}\.[0-9]{2}\.[0-9]{2}$/, {
      message: this.#i18n.t('validation.location-code', { field: this.#field, format: 'xx.xx.xx' })
    })
    return this;
  }

  cityCode() {
    this.#schema = this.#schema.regex(/^[1-9]{2}\.[0-9]{2}$/, {
      message: this.#i18n.t('validation.location-code', { field: this.#field, format: 'xx.xx' })
    })
    return this;
  }

  provinceCode() {
    this.#schema = this.#schema.regex(/^[1-9]{2}$/, {
      message: this.#i18n.t('validation.location-code', { field: this.#field, format: 'xx' })
    })
    return this;
  }
}
