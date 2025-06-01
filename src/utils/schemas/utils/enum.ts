import { i18n } from '@/i18n';
import type { Composer } from 'vue-i18n';
import { z } from 'zod';

export class EnumSchema<T extends z.EnumLike> {
  #schema!: z.ZodNativeEnum<T>

  constructor(field: string, nativeEnum: T) {
    const { t } = i18n.global as Composer;
    this.#schema = z.nativeEnum(nativeEnum, {
      invalid_type_error: t('validation.enum', { field, values: Object.values(nativeEnum) }),
      required_error: t('validation.required', { field }),
    })
  }

  getSchema() {
    return this.#schema;
  }
}
