import type { AtomicStore, DynamicSlice } from '@pro-laico/atomic/hook'
import type { StateCreator } from 'zustand'
export const dynamicSlice: StateCreator<AtomicStore, [], [], DynamicSlice> = (set, get) => ({
  persisted: {},
  memory: {},
  setValue: (key, value, persisted) => {
    if (!get().hydrated) return
    if (persisted) set((state) => ({ persisted: { ...state.persisted, [key]: value } }))
    else set((state) => ({ memory: { ...state.memory, [key]: value } }))
  },
  getValue: (key, persisted) => {
    return persisted ? get().persisted[key] : get().memory[key]
  },
  removeValue: (key, persisted) => {
    if (persisted) {
      set((state) => {
        const { [key]: _, ...rest } = state.persisted
        return { persisted: rest }
      })
    } else {
      set((state) => {
        const { [key]: _, ...rest } = state.memory
        return { memory: rest }
      })
    }
  },
})
