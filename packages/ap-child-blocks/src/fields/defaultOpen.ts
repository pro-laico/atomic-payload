import { APField } from '@pro-laico/ap-core'
import { deepMerge } from '@pro-laico/ap-core'
import type { APArgs, APFieldWrapper } from '@pro-laico/ap-core'
export const DefaultOpenField: APFieldWrapper<'checkbox', 'name' | 'apf' | 'type'> = (args) => {
  const baseField: APArgs<'checkbox'> = {
    name: 'defaultOpen',
    type: 'checkbox',
    apf: ['actions'],
    admin: { description: 'If checked, the portal will be open by default.' },
  }

  return APField(deepMerge(baseField, args))
}
