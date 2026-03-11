import { APField } from '@/fields/apf'
import { APArgs, APFieldWrapper } from '@/ts/types'
import deepMerge from '@/utilities/deepMerge'
import { strictSelectRegistry, StrictSet } from './registry'

type PresetFields = 'type' | 'typescriptSchema' | 'apf' | 'name' | 'options' | 'required'

export const PerformSelectField: APFieldWrapper<'select', PresetFields, { set: StrictSet }> = (args) => {
  let set: StrictSet = 'cookieConsent'
  let rest: Omit<APArgs<'select'>, PresetFields> = {}

  if (args) {
    const { set: setArg, ...restArg } = args
    set = setArg || 'cookieConsent'
    rest = restArg
  }

  const baseField: APArgs<'select'> = {
    name: 'perform',
    type: 'select',
    apf: ['actions'],
    required: true,
    options: strictSelectRegistry[set].perform.options,
    typescriptSchema: [() => ({ $ref: `#/definitions/${strictSelectRegistry[set]?.perform?.meta()?.id}` })],
  }

  return APField(deepMerge(baseField, rest))
}

export default PerformSelectField
