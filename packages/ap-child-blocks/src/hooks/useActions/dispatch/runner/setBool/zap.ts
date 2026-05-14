import { z } from '@pro-laico/ap-zap'

export const SetBoolSchema = z.ap.add(
  z.object({
    type: z.literal('RunSetBool'),
    key: z.string(),
    initialValue: z.boolean().nullable().optional(),
    persisted: z.boolean().nullable().optional(),
  }),
  { id: 'RunSetBool' },
)
