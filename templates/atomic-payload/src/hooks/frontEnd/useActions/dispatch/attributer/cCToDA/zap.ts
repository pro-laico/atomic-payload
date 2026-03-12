import { z } from '@/ts/zap'
import { cookieConsentKeys } from '@/fields/actions/strict/registry/cookieConsent'

export const CCtoDASchema = z.ap.add(
  z.object({
    type: z.literal('AttCCToDA'),
    listen: z.discriminatedUnion('listen', [
      z.object({ listen: z.literal('preference'), key: cookieConsentKeys }),
      z.object({ listen: z.literal('accept') }),
      z.object({ listen: z.literal('decline') }),
      z.object({ listen: z.literal('hasConsented') }),
      z.object({ listen: z.literal('previouslyConsented') }),
    ]),
    changeKey: z.string().nullable().optional(),
  }),
  { id: 'AttCCToDA' },
)
