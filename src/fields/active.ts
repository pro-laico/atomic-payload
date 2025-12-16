import { APField } from './apf'
import deepMerge from '@/utilities/deepMerge'
import type { APFieldWrapper, APArgs } from '@/ts/types'

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
