import { StateCreator } from 'zustand'
import type { AtomicStore, BaseSlice } from '@/ts/types'

export const baseSlice: StateCreator<AtomicStore, [], [], BaseSlice> = (set) => ({
  hydrated: false,
  setHydrated: (s) => set({ hydrated: s }),
})
