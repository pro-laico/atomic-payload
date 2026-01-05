import { z } from '@/ts/zap'

export const BoolToDASchema = z.ap.add(
  z.object({
    type: z.literal('AttBoolToDA'),
    key: z.string(),
    changeKey: z.string().nullable().optional(),
    persisted: z.boolean().nullable().optional(),
    initialValue: z.boolean().nullable().optional(),
  }),
  { id: 'AttBoolToDA' },
)
