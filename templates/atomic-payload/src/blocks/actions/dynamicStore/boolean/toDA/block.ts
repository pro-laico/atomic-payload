import type { Block } from 'payload'
import { ChangeKeyField, KeyTextField } from '@/fields/actions'

export const ActDSBoolToDA: Block = {
  slug: 'ActDSBoolToDA',
  interfaceName: 'ActDSBoolToDA',
  admin: { group: 'Dynamic Store' },
  labels: { singular: 'Boolean To Data Attribute', plural: 'Boolean To Data Attribute' },
  fields: [{ type: 'row', fields: [KeyTextField({ admin: { width: '25%' } }), ChangeKeyField({ admin: { width: '25%' } })] }],
}
