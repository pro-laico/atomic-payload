'use client'
import { useStore } from 'zustand'
import { createContext, useRef, useContext } from 'react'
import { createAtomicStore } from '@/hooks/frontEnd/atomicStore/create'
import type { AtomicStore, AtomicStoreProviderProps } from '@/ts/types'

export type AtomicStoreApi = ReturnType<typeof createAtomicStore>
export const AtomicStoreContext = createContext<AtomicStoreApi | undefined>(undefined)

export const AtomicStoreProvider = ({ children, initialState }: AtomicStoreProviderProps) => {
  const storeRef = useRef<AtomicStoreApi | null>(null)
  if (storeRef.current === null) storeRef.current = createAtomicStore(initialState)

  return <AtomicStoreContext.Provider value={storeRef.current}>{children}</AtomicStoreContext.Provider>
}

export const useAtomicStore = <T,>(selector: (store: AtomicStore) => T): T => {
  const atomicStoreContext = useContext(AtomicStoreContext)
  if (!atomicStoreContext) throw new Error(`useAtomicStore must be used within AtomicStoreProvider`)
  return useStore(atomicStoreContext, selector)
}
