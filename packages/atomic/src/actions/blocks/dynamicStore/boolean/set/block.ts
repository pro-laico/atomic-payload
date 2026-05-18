import { InitialValueCheckboxField, KeyTextField, PersistedField, SetDataField } from '@pro-laico/atomic/actions/fields'
import type { Block } from 'payload'

export const ActDSSetBool: Block = {
  slug: 'ActDSSetBool',
  interfaceName: 'ActDSSetBool',
  admin: { group: 'Dynamic Store' },
  labels: { singular: 'Set Boolean', plural: 'Set Boolean' },
  fields: [
    KeyTextField({ admin: { width: '25%' } }),
    PersistedField({ admin: { width: '25%' } }),
    SetDataField({ admin: { width: '25%' } }),
    InitialValueCheckboxField({ admin: { width: '25%' } }),
  ],
}
