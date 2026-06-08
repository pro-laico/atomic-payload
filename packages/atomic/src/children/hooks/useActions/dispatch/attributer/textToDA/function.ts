import type { AttFunction } from '@pro-laico/atomic/actions'
export const AttTextToDA: AttFunction<'AttTextToDA'> = ({
  key,
  persisted,
  changeKey,
  initialValue,
  context: {
    atomicStore: { getValue, hydrated },
  },
}) => {
  // Prevents SSR hydration errors
  if (!hydrated) {
    if (initialValue) return { [`data-${changeKey || key}`]: initialValue }
    return
  }

  const currentValue = getValue(key, persisted)
  const newValue = currentValue ? currentValue : initialValue
  if (newValue) return { [`data-${changeKey || key}`]: String(newValue) }
}
