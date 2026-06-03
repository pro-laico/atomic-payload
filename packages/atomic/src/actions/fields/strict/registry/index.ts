import theme from './theme'
import cookieConsent from './cookieConsent'

export type StrictSet = 'cookieConsent' | 'theme'

export const strictSelectRegistry = { cookieConsent, theme }
