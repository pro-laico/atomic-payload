import { createStore } from 'zustand'
import { baseSlice } from './slices/base'
import { persist } from 'zustand/middleware'
import { dynamicSlice } from './slices/dynamic'
import { consentSlice, STORAGE_KEYS } from './slices/consent'
import type { AtomicStore, AtomicStoreInitialState } from '@/ts/types'

const safeStorageOperation = <T>(operation: () => T, fallback: T): T => {
  try {
    return operation()
  } catch (error) {
    console.error('Storage operation failed:', error)
    return fallback
  }
}

//TODO: Implement the initialState, so actions can be site wide, rather than by page. Though this requires many backend changes.
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
          // Session storage takes precedence (for session-only declines)
          if (session === 'false') state.declineCookies()

          // Check localStorage for persistent consent
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
        //Ensures there are no issues with conflicting versions of the store when editing pages in admin.
        version: initialState.version,
        migrate: (persistedState, version) => {
          if (version !== initialState.version && typeof persistedState === 'object' && persistedState !== null && 'persisted' in persistedState) {
            delete persistedState.persisted
          }
          return persistedState
        },
      },
    ),
  )
}
