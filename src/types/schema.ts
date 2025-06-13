import { z, ZodArray, ZodObject, ZodString, ZodType, type ZodTypeDef } from 'zod';

export type SchemaType<T extends ZodType<unknown, ZodTypeDef, unknown>> = z.output<T>

export type SimpleRequestSchema = ZodObject<{ names: ZodArray<ZodString, "many"> | ZodArray<ZodString, "atleastone"> }>