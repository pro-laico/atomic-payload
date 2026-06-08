import type { RunFunction } from '@pro-laico/atomic/actions'

type CycleTextItem = { value: string; initialValue?: boolean | null }

export const RunCycleText: RunFunction<'RunCycleText'> = ({ key, textArray, persisted, context }) => {
  const {
    atomicStore: { setValue, getValue, removeValue },
  } = context
  let value: string | null = null
  const currentValue = getValue(key, persisted)
  const items = textArray as CycleTextItem[]

  if (items.length === 1) {
    if (currentValue === items[0].value) removeValue(key, persisted)
    else value = items[0].value
  } else {
    const currentIndex = items.findIndex((item: CycleTextItem) => item.value === currentValue)
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % items.length
      value = items[nextIndex].value
    } else {
      const initialIndex = items.findIndex((item: CycleTextItem) => item.initialValue)
      if (initialIndex !== -1) {
        const targetIndex = (initialIndex + 1) % items.length
        value = items[targetIndex].value
      } else value = items[0].value
    }
  }

  if (value === undefined || value === null) return { success: false, message: 'No valid value found in RunCycleText' }
  setValue(key, value, persisted)
  return { success: true }
}
