import { APField } from './index'
import deepMerge from '../utilities/deepMerge'
import type { APArgs, APFieldWrapper } from '@pro-laico/ap-types'

/**
 * Reusable Atomic Payload `active` checkbox field. Wires the `active` APF flag
 * and ships with sensible admin defaults.
 */
export const ActiveField: APFieldWrapper<'checkbox', 'name' | 'apf' | 'type' | 'defaultValue'> = (args) => {
  const baseField: APArgs<'checkbox'> = {
    type: 'checkbox',
    apf: ['active'],
    name: 'active',
    required: true,
    index: true,
    admin: { style: { maxWidth: '100px', alignSelf: 'center' } },
  }

  return APField(deepMerge(baseField, args))
}
