import { AttFunction } from '@/ts/types/actions'

export const AttFormStatusToDA: AttFunction<'AttFormStatusToDA'> = ({ key, context }) => {
  if (!context.fullFormContext) {
    console.error('AttFormStatusToDA: fullFormContext is undefined')
    return
  }
  const { getValue, hydrated } = context.atomicStore

  let returns: Record<string, string> | undefined
  if (!hydrated || !key) return //Prevents SSR hydration errors

  let formKeyValue = getValue(key, false) as undefined | string

  switch (formKeyValue) {
    case 'setReset':
    case 'resetting':
    case 'setPending':
      formKeyValue = 'pending'
      break
  }
  if (formKeyValue) returns = { [`data-${formKeyValue}`]: '' }
  return returns
}
