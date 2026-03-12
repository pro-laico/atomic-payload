import type { RunFunction } from '@/ts/types/actions'

export const RunCycleText: RunFunction<'RunCycleText'> = ({ key, textArray, persisted, context }) => {
  const {
    atomicStore: { setValue, getValue, removeValue },
  } = context
  let value: string | null = null
  const currentValue = getValue(key, persisted)

  if (textArray.length === 1) {
    if (currentValue === textArray[0].value) removeValue(key, persisted)
    else value = textArray[0].value
  } else {
    const currentIndex = textArray.findIndex((item) => item.value === currentValue)
    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % textArray.length
      value = textArray[nextIndex].value
    } else {
      const initialIndex = textArray.findIndex((item) => item.initialValue)
      if (initialIndex !== -1) {
        const targetIndex = (initialIndex + 1) % textArray.length
        value = textArray[targetIndex].value
      } else value = textArray[0].value
    }
  }

  if (value === undefined || value === null) return { success: false, message: 'No valid value found in RunCycleText' }
  setValue(key, value, persisted)
  return { success: true }
}
