import { APField } from '@/fields/apf'
import deepMerge from '@/utilities/deepMerge'
import type { APArgs, APFieldWrapper } from '@/ts/types'

const description = 'The initial value to set the key to. Checked = true, Unchecked = false. First click set the opposite of this value.'

/** Typically utilized to set what the initial value of an action will be.
 *
 * @defaults { name: 'initialValue', apf: ['actions'], type: 'checkbox' }
 */
export const InitialValueCheckboxField: APFieldWrapper<'checkbox', 'name' | 'apf' | 'type'> = (args) => {
  const baseField: APArgs<'checkbox'> = { name: 'initialValue', type: 'checkbox', apf: ['actions'], admin: { description } }
  return APField(deepMerge(baseField, args))
}
