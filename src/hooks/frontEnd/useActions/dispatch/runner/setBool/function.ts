import type { RunFunction } from '@/ts/types/actions'

export const RunSetBool: RunFunction<'RunSetBool'> = ({ key, initialValue, persisted, context }) => {
  const { setValue, getValue } = context.atomicStore

  const storedValue = getValue(key, persisted)
  const newValue = storedValue !== undefined ? !storedValue : !initialValue
  setValue(key, newValue, persisted)
  return { success: true, key, newValue }
}
