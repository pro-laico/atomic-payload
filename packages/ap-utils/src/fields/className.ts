import { APField } from '@pro-laico/ap-apf'
import type { APArgs, APFieldWrapper } from '@pro-laico/ap-types'
import deepMerge from '../utilities/deepMerge'

type PresetFields = 'apf' | 'type' | 'name'

export const ClassNameField: APFieldWrapper<'textarea', PresetFields, { namePrefix?: string }> = (args) => {
  let namePrefix = ''
  let rest: Omit<APArgs<'textarea'>, PresetFields> | undefined

  if (args) {
    const { namePrefix: namePrefixArg, ...restArg } = args
    namePrefix = namePrefixArg || ''
    rest = restArg
  }

  const baseField: APArgs<'textarea'> = {
    type: 'textarea',
    apf: ['classes'],
    name: `${namePrefix}ClassName`,
    docLink: 'https://atomicpayload.com/fields/classname',
    admin: { description: 'Add atomic style classes or shortcuts here.' },
  }

  return APField(deepMerge(baseField, rest))
}
