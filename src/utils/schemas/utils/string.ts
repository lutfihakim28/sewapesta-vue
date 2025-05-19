import { validationMessages } from '@/utils/constants/validation-message';
import { z } from 'zod';

export class StringSchema {
  #schema!: z.ZodString
  #field!: string;

  constructor(field: string) {
    this.#schema = z.string({
      invalid_type_error: validationMessages.string(field),
      required_error: validationMessages.required(field)
    })
    this.#field = field;
  }

  getSchema() {
    return this.#schema;
  }

  numeric(option?: Partial<{ min: number, subset: 'whole' | 'natural' | 'integer' }>) {
    this.#schema
      .regex(/^\d+(\.\d+)?$/, {
        message: validationMessages.numeric(this.#field),
      }).refine((value) => {
        if (!option?.min) return true;
        return Number(value) >= option.min;
      })
      .refine((value) => {
        if (!option?.subset) return true;
        if (option.subset === 'integer') {
          return Number.isInteger(value)
        }
        if (option.subset === 'natural') {
          return Number.isInteger(value) && Number(value) > 0
        }
        if (option.subset === 'whole') {
          return Number.isInteger(value) && Number(value) >= 0
        }
      })
    return this;
  }

  phone() {
    this.#schema
      .regex(/^\d+(\.\d+)?$/, {
        message: validationMessages.numeric('Phone number'),
      }).regex(/^628[1-9][0-9]{6,9}$/, {
        message: 'Phone number should start with 628 with minimum 10 digits and maximum 13 digits.'
      })
    return this;
  }

  min(length: number) {
    this.#schema.min(length, {
      message: validationMessages.minLength(this.#field, length)
    })
    return this;
  }

  length(length: number) {
    this.#schema.length(length, {
      message: validationMessages.length(this.#field, length)
    })
    return this;
  }

  subdistrictCode() {
    this.#schema.regex(/^[1-9]{2}\.[0-9]{2}\.[0-9]{2}\.[1-9][0-9]{2}[1-9]$/, {
      message: 'Should in format xx.xx.xx.xxxx'
    })
    return this;
  }

  districtCode() {
    this.#schema.regex(/^[1-9]{2}\.[0-9]{2}\.[0-9]{2}$/, {
      message: 'Should in format xx.xx.xx'
    })
    return this;
  }

  cityCode() {
    this.#schema.regex(/^[1-9]{2}\.[0-9]{2}$/, {
      message: 'Should in format xx.xx'
    })
    return this;
  }

  provinceCode() {
    return this.length(2).numeric();
  }
}