import { validationMessages } from '@/constants/validationMessages';
import { accountMutationsTable } from '@/db/schema/accountMutations';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const AccountMutationRequestSchema = createInsertSchema(accountMutationsTable, {
  amount: z
    .number({
      message: validationMessages.requiredNumber('Nominal'),
    })
    .positive({
      message: validationMessages.positiveNumber('Nominal')
    })
    .openapi({ example: 100000 }),
  description: z.optional(z.string()),
}).pick({ amount: true, description: true }).openapi('AccountMutationRequest')

export type AccountMutationRequest = z.infer<typeof AccountMutationRequestSchema>