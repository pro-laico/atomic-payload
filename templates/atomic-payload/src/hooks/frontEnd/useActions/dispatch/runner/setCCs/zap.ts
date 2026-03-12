import { z } from '@/ts/zap'
import { cookieConsentKeys } from '@/fields/actions/strict/registry/cookieConsent'

export const SetCCSchema = z.ap.add(
  z.object({
    type: z.literal('RunSetCC'),
    values: z.discriminatedUnion('perform', [
      z.object({ perform: z.literal('decline') }),
      z.object({ perform: z.literal('preference'), key: z.ap.get('CookieConsentPreferenceKeys', cookieConsentKeys) }),
      z.object({ perform: z.literal('accept'), acceptAll: z.boolean().optional() }),
    ]),
  }),
  { id: 'RunSetCC' },
)
