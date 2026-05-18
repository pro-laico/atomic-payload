'use client'

import type { AtomicStore, AtomicStoreProviderProps } from '@pro-laico/atomic/hook'
import { createContext, useContext, useState } from 'react'
import { useStore } from 'zustand'
import { createAtomicStore } from './createStore'
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
