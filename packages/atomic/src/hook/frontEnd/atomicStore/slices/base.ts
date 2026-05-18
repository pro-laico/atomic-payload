import type { AtomicStore, BaseSlice } from '@pro-laico/atomic/hook'
import type { StateCreator } from 'zustand'
export const baseSlice: StateCreator<AtomicStore, [], [], BaseSlice> = (set) => ({
  hydrated: false,
  setHydrated: (s) => set({ hydrated: s }),
})
