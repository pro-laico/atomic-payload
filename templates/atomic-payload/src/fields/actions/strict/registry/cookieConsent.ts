import { z } from '@/ts/zap'

export const cookieConsentKeys = z.ap.add(
  z.enum(['functional', 'security', 'analytics', 'marketing', 'userData', 'adPersonalization', 'contentPersonalization']),
  { id: 'CookieConsentPreferenceKeys' },
)
export const cookieConsentListen = z.ap.add(z.enum(['preference', 'accept', 'decline', 'hasConsented', 'previouslyConsented']), {
  id: 'CookieConsentListen',
})
export const cookieConsentPerform = z.ap.add(z.enum(['preference', 'accept', 'decline']), { id: 'CookieConsentPerform' })

const cookieConsent = { key: cookieConsentKeys, listen: cookieConsentListen, perform: cookieConsentPerform }

export default cookieConsent
