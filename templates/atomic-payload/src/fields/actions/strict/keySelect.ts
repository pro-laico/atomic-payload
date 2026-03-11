import { APField } from '@/fields/apf'
import deepMerge from '@/utilities/deepMerge'
import type { APArgs, APFieldWrapper } from '@/ts/types'
import { StrictSet, strictSelectRegistry } from './registry'

type PresetFields = 'type' | 'typescriptSchema' | 'apf' | 'name' | 'options' | 'required'

export const KeySelectField: APFieldWrapper<'select', PresetFields, { set: StrictSet }> = (args) => {
  let set: StrictSet = 'cookieConsent'
  let rest: Omit<APArgs<'select'>, PresetFields> = {}

  if (args) {
    const { set: setArg, ...restArg } = args
    set = setArg || 'cookieConsent'
    rest = restArg
  }

  const baseField: APArgs<'select'> = {
    name: 'key',
    type: 'select',
    apf: ['actions'],
    required: true,
    options: strictSelectRegistry[set].key.options,
    typescriptSchema: [() => ({ $ref: `#/definitions/${strictSelectRegistry[set].key.meta()?.id}` })],
  }
  return APField(deepMerge(baseField, rest))
}
export default KeySelectField
