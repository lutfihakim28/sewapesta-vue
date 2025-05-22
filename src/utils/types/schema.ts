import { z, ZodAny, ZodType, type ZodTypeDef } from 'zod';

export type SchemaType<T extends ZodType<unknown, ZodTypeDef, unknown>> = z.output<T>