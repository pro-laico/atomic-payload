import { z } from '@pro-laico/atomic-payload-zap'

export const FormErrorToDASchema = z.ap.add(
  z.object({
    type: z.literal('AttFormErrorToDA'),
    key: z.string(),
    inputName: z.string().nullable().optional(),
  }),
  { id: 'AttFormErrorToDA' },
)
