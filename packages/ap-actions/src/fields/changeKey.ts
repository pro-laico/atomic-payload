import { APField, deepMerge } from '@pro-laico/ap-apf'
import type { APArgs, APFieldWrapper } from '@pro-laico/ap-apf'
/** Used in attributer actions to change the output data attributes key. Without impacting the key within the atomic store
 *
 * @defaults { name: 'changeKey', apf: ['actions'], type: 'text', kebab: true }
 */
export const ChangeKeyField: APFieldWrapper<'text', 'name' | 'apf' | 'type' | 'kebab'> = (args) => {
  const baseField: APArgs<'text'> = { type: 'text', apf: ['actions'], name: 'changeKey', kebab: true }
  return APField(deepMerge(baseField, args))
}
