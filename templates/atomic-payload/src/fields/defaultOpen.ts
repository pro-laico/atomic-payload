import { APField } from '@pro-laico/atomic-payload-apf'
import { deepMerge } from '@pro-laico/ap-utils'
import { APArgs, APFieldWrapper } from '@/ts/types'

export const DefaultOpenField: APFieldWrapper<'checkbox', 'name' | 'apf' | 'type'> = (args) => {
  const baseField: APArgs<'checkbox'> = {
    name: 'defaultOpen',
    type: 'checkbox',
    apf: ['actions'],
    admin: { description: 'If checked, the portal will be open by default.' },
  }

  return APField(deepMerge(baseField, args))
}
