import type { Block } from 'payload'
import { ChangeKeyField, KeyTextField } from '@/fields/actions'

export const ActDSTextToDA: Block = {
  slug: 'ActDSTextToDA',
  interfaceName: 'ActDSTextToDA',
  admin: { group: 'Dynamic Store' },
  labels: { singular: 'Text To Data Attribute', plural: 'Text To Data Attribute' },
  fields: [{ type: 'row', fields: [KeyTextField({ admin: { width: '25%' } }), ChangeKeyField({ admin: { width: '25%' } })] }],
}
