import type { Block } from 'payload'
import { APField } from '@/fields/apf'
import { ValidationMessageField } from '@/fields/validationMessage'

export const IvContains: Block = {
  slug: 'IvContains',
  interfaceName: 'IvContains',
  admin: { disableBlockName: true },
  labels: { singular: 'Contains Value', plural: 'Contains Value' },
  custom: { usedOn: ['text', 'textarea', 'email'] },
  fields: [APField({ type: 'text', apf: ['form'], name: 'containsValue', required: true }), ValidationMessageField],
}
