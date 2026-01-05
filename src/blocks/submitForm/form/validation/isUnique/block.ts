import type { Block } from 'payload'
import { APField } from '@/fields/apf'
import { ValidationMessageField } from '@/fields/validationMessage'

const d = {
  limit: 'The number of times the field can be used. It defaults to 1.',
}

export const FvIsUnique: Block = {
  slug: 'FvIsUnique',
  interfaceName: 'FvIsUnique',
  admin: { disableBlockName: true },
  labels: { singular: 'Is Unique', plural: 'Is Unique' },
  fields: [
    APField({ type: 'text', apf: ['form'], name: 'fieldName', required: true }),
    APField({ type: 'number', apf: ['form'], name: 'limit', required: true, admin: { description: d.limit } }),
    ValidationMessageField,
  ],
}
