import type { StateCreator } from 'zustand'
import type { AtomicStore, BaseSlice } from '@pro-laico/ap-atomic-hook'
export const baseSlice: StateCreator<AtomicStore, [], [], BaseSlice> = (set) => ({
  hydrated: false,
  setHydrated: (s) => set({ hydrated: s }),
})
