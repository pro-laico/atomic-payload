import { z } from '@/ts/zap'

export const FormErrorToDASchema = z.ap.add(
  z.object({
    type: z.literal('AttFormErrorToDA'),
    key: z.string(),
    inputName: z.string().nullable().optional(),
  }),
  { id: 'AttFormErrorToDA' },
)
