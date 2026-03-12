import { StateCreator } from 'zustand'
import type { AtomicStore, ConsentPreferences, ConsentSlice } from '@/ts/types'

const COOKIE_EXPIRY_YEARS = 1
export const STORAGE_KEYS = {
  COOKIE_CONSENT: 'cookieConsent',
  COOKIE_PREFERENCES: 'cookiePreferences',
} as const

const DEFAULT_PREFERENCES: ConsentPreferences = {
  functional: true,
  security: true,
  analytics: false,
  marketing: false,
  userData: false,
  adPersonalization: false,
  contentPersonalization: false,
}

// Utility functions
const setCookie = (name: string, value: string, expiryYears: number = COOKIE_EXPIRY_YEARS) => {
  const date = new Date()
  date.setFullYear(date.getFullYear() + expiryYears)
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax; Secure`
}

const safeStorageOperation = <T>(operation: () => T, fallback: T): T => {
  try {
    return operation()
  } catch (error) {
    console.error('Storage operation failed:', error)
    return fallback
  }
}

export const consentSlice: StateCreator<AtomicStore, [], [], ConsentSlice> = (set) => ({
  hasConsented: null,
  previouslyConsented: null,
  preferences: DEFAULT_PREFERENCES,
  setPreference: (category, value) => {
    set((state) => ({ preferences: { ...state.preferences, [category]: category === 'functional' || category === 'security' ? true : value } }))
  },
  acceptCookies: (preferences) => {
    const newPreferences = { ...DEFAULT_PREFERENCES, ...preferences, functional: true, security: true }

    // Batch storage operations
    safeStorageOperation(() => {
      setCookie(STORAGE_KEYS.COOKIE_CONSENT, 'true')
      localStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, 'true')
      localStorage.setItem(STORAGE_KEYS.COOKIE_PREFERENCES, JSON.stringify(newPreferences))
      sessionStorage.removeItem(STORAGE_KEYS.COOKIE_CONSENT)
    }, null)

    set({ hasConsented: true, previouslyConsented: true, preferences: newPreferences })
  },
  declineCookies: () => {
    const declinedPreferences = {
      ...DEFAULT_PREFERENCES,
      // Only functional and security remain true
      analytics: false,
      marketing: false,
      userData: false,
      adPersonalization: false,
      contentPersonalization: false,
    }

    // Batch storage operations
    safeStorageOperation(() => {
      localStorage.removeItem(STORAGE_KEYS.COOKIE_CONSENT)
      localStorage.removeItem(STORAGE_KEYS.COOKIE_PREFERENCES)
      sessionStorage.setItem(STORAGE_KEYS.COOKIE_CONSENT, 'false')
    }, null)

    set({ previouslyConsented: true, hasConsented: false, preferences: declinedPreferences })
  },
})
