import { APField, deepMerge } from '@pro-laico/ap-apf'
import type { APArgs, APFieldWrapper } from '@pro-laico/ap-types'

const description = 'The name of the key to set. Use Kebab Case. (e.g. status-accepted)'

export const KeyTextField: APFieldWrapper<'text', 'name' | 'apf' | 'type'> = (args) => {
  const baseField: APArgs<'text'> = { name: 'key', type: 'text', apf: ['actions'], kebab: true, required: true, admin: { description } }
  return APField(deepMerge(baseField, args))
}
