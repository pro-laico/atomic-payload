import { APField } from '@/fields/apf'
import deepMerge from '@/utilities/deepMerge'
import { APArgs, APFieldWrapper } from '@/ts/types'
import { strictSelectRegistry, StrictSet } from './registry'

type PresetFields = 'type' | 'typescriptSchema' | 'apf' | 'name' | 'options' | 'required'

export const ListenSelectField: APFieldWrapper<'select', PresetFields, { set: StrictSet }> = (args) => {
  let set: StrictSet = 'cookieConsent'
  let rest: Omit<APArgs<'select'>, PresetFields> = {}

  if (args) {
    const { set: setArg, ...restArg } = args
    set = setArg || 'cookieConsent'
    rest = restArg
  }
  const baseField: APArgs<'select'> = {
    name: 'listen',
    type: 'select',
    apf: ['actions'],
    required: true,
    options: strictSelectRegistry[set].listen.options,
    typescriptSchema: [() => ({ $ref: `#/definitions/${strictSelectRegistry[set]?.listen?.meta()?.id}` })],
  }

  return APField(deepMerge(baseField, rest))
}
export default ListenSelectField
