import type { Block } from 'payload'
import { APField } from '@pro-laico/core'
import { ValidationMessageField } from '@pro-laico/atomic/forms/fields/validationMessage'

export const IvContains: Block = {
  slug: 'IvContains',
  interfaceName: 'IvContains',
  admin: { disableBlockName: true },
  labels: { singular: 'Contains Value', plural: 'Contains Value' },
  custom: { usedOn: ['text', 'textarea', 'email'] },
  fields: [APField({ type: 'text', apf: ['form'], name: 'containsValue', required: true }), ValidationMessageField],
}
