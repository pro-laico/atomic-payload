import { CheckboxField } from 'payload'
import { deepMerge } from '@pro-laico/ap-utils'

type KeepMountedFieldType = (args?: Partial<CheckboxField>) => CheckboxField

const description = 'If checked, the portal will remain in the DOM when hidden.'

export const KeepMountedField: KeepMountedFieldType = (args) => {
  const keepMountedField: CheckboxField = { name: 'keepMounted', type: 'checkbox', admin: { description } }
  return deepMerge(keepMountedField, args)
}
