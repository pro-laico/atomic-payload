import { APField } from '@/fields/apf'
import deepMerge from '@/utilities/deepMerge'
import type { APArgs, APFieldWrapper } from '@/ts/types'

const description = 'The name of the key to set. Use Kebab Case. (e.g. status-accepted)'

export const KeyTextField: APFieldWrapper<'text', 'name' | 'apf' | 'type'> = (args) => {
  const baseField: APArgs<'text'> = { name: 'key', type: 'text', apf: ['actions'], kebab: true, required: true, admin: { description } }
  return APField(deepMerge(baseField, args))
}
