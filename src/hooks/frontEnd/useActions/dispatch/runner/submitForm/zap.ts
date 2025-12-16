import { z } from '@/ts/zap'

export const RunSubmitFormSchema = z.ap.add(
  z.object({
    type: z.literal('RunSubmitForm'),
    formName: z.string().nullable().optional(),
  }),
  { id: 'RunSubmitForm' },
)
