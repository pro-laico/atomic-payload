'use client'

import { useStore } from 'zustand'
import { createContext, useState, useContext } from 'react'
import { createAtomicStore } from './createStore'
import type { AtomicStore, AtomicStoreProviderProps } from '@pro-laico/ap-types'

export type AtomicStoreApi = ReturnType<typeof createAtomicStore>
export const AtomicStoreContext = createContext<AtomicStoreApi | undefined>(undefined)

export const AtomicStoreProvider = ({ children, initialState }: AtomicStoreProviderProps) => {
  const [store] = useState(() => createAtomicStore(initialState))

  return <AtomicStoreContext.Provider value={store}>{children}</AtomicStoreContext.Provider>
}

export const useAtomicStore = <T,>(selector: (store: AtomicStore) => T): T => {
  const atomicStoreContext = useContext(AtomicStoreContext)
  if (!atomicStoreContext) throw new Error(`useAtomicStore must be used within AtomicStoreProvider`)
  return useStore(atomicStoreContext, selector)
}

export { createAtomicStore }
