import { AttFunction } from '@/ts/types/actions'

export const AttBoolToDA: AttFunction<'AttBoolToDA'> = ({ key, persisted, initialValue, changeKey, context }) => {
  const { getValue, hydrated } = context.atomicStore
  if (!hydrated) {
    if (initialValue) return { [`data-${changeKey || key}`]: '' }
    else return
  } //Prevents SSR hydration errors

  const storedValue = getValue(key, persisted)
  const newValue = storedValue && typeof storedValue === 'boolean' ? storedValue : initialValue
  if (newValue) return { [`data-${changeKey || key}`]: '' }
  else return
}
