import { APField } from './apf'
import deepMerge from '@/utilities/deepMerge'
import type { APArgs, APFieldWrapper } from '@/ts/types'

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
