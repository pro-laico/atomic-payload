import { APField } from '@/fields/apf'
import deepMerge from '@/utilities/deepMerge'
import type { APArgs, APFieldWrapper } from '@/ts/types'

const description =
  'If true, the value will be persisted in the browser storage, and replace the initial value. Beware of FOUC is using these for initial visual state.'

/** Used in actions to persist the value in the browser storage.
 * @defaults { name: 'persisted', apf: ['actions'], type: 'checkbox' }
 */
export const PersistedField: APFieldWrapper<'checkbox', 'name' | 'apf' | 'type'> = (args) => {
  const baseField: APArgs<'checkbox'> = { name: 'persisted', type: 'checkbox', apf: ['actions'], admin: { description } }
  return APField(deepMerge(baseField, args))
}
