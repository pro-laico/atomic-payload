import { AttFunction, ImplementedStorageTypes } from '@/ts/types'

export const AttFormErrorToDA: AttFunction<'AttFormErrorToDA'> = ({ key, inputName = 'form', context }) => {
  if (!context.fullFormContext) {
    console.error('AttFormErrorToDA: fullFormContext is undefined')
    return
  }
  const { getValue, hydrated } = context.atomicStore

  if (!hydrated) return //Prevents SSR hydration errors
  if (!key) return
  const inputKey = inputName || 'form'

  if (context.fullFormContext.formResponse?.success) return

  const storedValue: ImplementedStorageTypes = getValue(`${key}-response`, false)
  if (!storedValue || typeof storedValue !== 'object') return

  const errorMessage = storedValue[inputKey]
  if (!errorMessage) return
  return { [`data-error`]: errorMessage || '' }
}
