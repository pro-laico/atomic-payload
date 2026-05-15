import { z } from '@pro-laico/zap'

export const FormStatusToDASchema = z.ap.add(
  z.object({
    type: z.literal('AttFormStatusToDA'),
    key: z.string(),
    changeKey: z.string().nullable().optional(),
  }),
  { id: 'AttFormStatusToDA' },
)
