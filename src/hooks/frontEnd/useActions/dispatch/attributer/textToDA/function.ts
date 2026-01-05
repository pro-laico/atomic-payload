import { AttFunction } from '@/ts/types/actions'

export const AttTextToDA: AttFunction<'AttTextToDA'> = ({
  key,
  persisted,
  changeKey,
  initialValue,
  context: {
    atomicStore: { getValue, hydrated },
  },
}) => {
  if (!hydrated) {
    if (initialValue) return { [`data-${changeKey || key}`]: initialValue }
    else return
  } //Prevents SSR hydration errors

  const currentValue = getValue(key, persisted)
  const newValue = currentValue ? currentValue : initialValue
  if (newValue) return { [`data-${changeKey || key}`]: String(newValue) }
  else return
}
