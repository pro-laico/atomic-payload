import { cookieConsentKeys } from '@pro-laico/atomic/actions/fields/strict/registry/cookieConsent'
import { z } from '@pro-laico/zap'

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
