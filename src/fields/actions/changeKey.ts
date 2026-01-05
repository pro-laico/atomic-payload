import { APField } from '@/fields/apf'
import deepMerge from '@/utilities/deepMerge'
import type { APArgs, APFieldWrapper } from '@/ts/types'

/** Used in attributer actions to change the output data attributes key. Without impacting the key within the atomic store
 *
 * @defaults { name: 'changeKey', apf: ['actions'], type: 'text', kebab: true }
 */
export const ChangeKeyField: APFieldWrapper<'text', 'name' | 'apf' | 'type' | 'kebab'> = (args) => {
  const baseField: APArgs<'text'> = { type: 'text', apf: ['actions'], name: 'changeKey', kebab: true }
  return APField(deepMerge(baseField, args))
}
