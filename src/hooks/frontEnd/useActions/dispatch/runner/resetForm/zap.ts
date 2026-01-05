import { z } from '@/ts/zap'

export const ResetFormSchema = z.ap.add(
  z.object({
    type: z.literal('RunResetForm'),
    formName: z.string().nullable().optional(),
  }),
  { id: 'RunResetForm' },
)
