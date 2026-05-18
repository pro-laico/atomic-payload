import type { AtomicStore, AtomicStoreInitialState } from '@pro-laico/atomic/hook'
import { createStore } from 'zustand'
import { persist } from 'zustand/middleware'
import { baseSlice } from './slices/base'
import { consentSlice, STORAGE_KEYS } from './slices/consent'
import { dynamicSlice } from './slices/dynamic'

const safeStorageOperation = <T>(operation: () => T, fallback: T): T => {
  try {
    return operation()
  } catch (error) {
    console.error('Storage operation failed:', error)
    return fallback
  }
}

export const createAtomicStore = (initialState: AtomicStoreInitialState) => {
  return createStore<AtomicStore>()(
    persist(
      (...a) => ({
        ...baseSlice(...a),
        ...consentSlice(...a),
        ...dynamicSlice(...a),
      }),
      {
        name: 'atomic-store',
        partialize: (state) => ({
          persisted: state.persisted,
          preferences: state.preferences,
          hasConsented: state.hasConsented,
          previouslyConsented: state.previouslyConsented,
        }),
        onRehydrateStorage: () => (state) => {
          if (!state) return
          state.setHydrated(true)

          const local = safeStorageOperation(() => localStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT), null)
          const session = safeStorageOperation(() => sessionStorage.getItem(STORAGE_KEYS.COOKIE_CONSENT), null)
          if (session === 'false') state.declineCookies()

          if (local === 'true') {
            const storedPreferences = safeStorageOperation(() => localStorage.getItem(STORAGE_KEYS.COOKIE_PREFERENCES), null)

            if (storedPreferences) {
              try {
                const preferences = JSON.parse(storedPreferences)
                state.acceptCookies(preferences)
              } catch (error) {
                console.error('Error parsing stored preferences:', error)
                state.acceptCookies()
              }
            } else state.acceptCookies()
          }
        },
        version: initialState.version,
        migrate: (persistedState, version) => {
          if (version !== initialState.version && typeof persistedState === 'object' && persistedState !== null && 'persisted' in persistedState) {
            delete (persistedState as { persisted?: unknown }).persisted
          }
          return persistedState
        },
      },
    ),
  )
}
