import cookieConsent from './cookieConsent'
import theme from './theme'

export type StrictSet = 'cookieConsent' | 'theme'

export const strictSelectRegistry = { cookieConsent, theme }
