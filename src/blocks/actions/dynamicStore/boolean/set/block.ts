import type { Block } from 'payload'
import { KeyTextField, SetDataField, PersistedField, InitialValueCheckboxField } from '@/fields/actions'

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
