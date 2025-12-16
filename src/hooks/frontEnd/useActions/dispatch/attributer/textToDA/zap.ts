import { z } from '@/ts/zap'

export const TextToDASchema = z.ap.add(
  z.object({
    type: z.literal('AttTextToDA'),
    key: z.string(),
    persisted: z.boolean().nullable().optional(),
    changeKey: z.string().nullable().optional(),
    initialValue: z.string().nullable().optional(),
  }),
  { id: 'AttTextToDA' },
)
