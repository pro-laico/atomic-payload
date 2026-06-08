import { APField, deepMerge } from '@pro-laico/core'
import type { APArgs, APFieldWrapper } from '@pro-laico/core'

const description = 'If true, the value will be set as a data attribute on the element. Which can be used by atomic classes.'

/** Used in actions to set the value as a data attribute on the element. Which can be used by atomic classes.
 *
 * @defaults { name: 'setDA', apf: ['actions'], type: 'checkbox' }
 */
export const SetDataField: APFieldWrapper<'checkbox', 'name' | 'apf' | 'type'> = (args) => {
  const baseField: APArgs<'checkbox'> = {
    name: 'setDA',
    type: 'checkbox',
    apf: ['actions'],
    admin: { description },
    label: 'Set As Data Attribute (Atomic Class)',
  }
  return APField(deepMerge(baseField, args))
}
