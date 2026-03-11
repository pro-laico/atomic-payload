import { StateCreator } from 'zustand'
import type { AtomicStore, DynamicSlice } from '@/ts/types'

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

/*   clearStorage: (persisted) => {
    if (persisted) set({ persisted: {} })
    else set({ memory: {} })
  },
  setMultiple: (entries) => {
    const persistedUpdates: Record<string, ImplementedStorageTypes> = {}
    const memoryUpdates: Record<string, ImplementedStorageTypes> = {}
    entries.forEach(({ key, value, persisted }) => {
      if (persisted) persistedUpdates[key] = value
      else memoryUpdates[key] = value
    })
    if (Object.keys(persistedUpdates).length) set((state) => ({ persisted: { ...state.persisted, ...persistedUpdates } }))
    if (Object.keys(memoryUpdates).length) set((state) => ({ memory: { ...state.memory, ...memoryUpdates } }))
  },
  getMultiple: (keys) => {
    const state = get()
    const result: Record<string, ImplementedStorageTypes> = {}
    keys.forEach(({ key, persisted }) => {
      result[key] = persisted ? state.persisted[key] : state.memory[key]
    })
    return result
  }, */
