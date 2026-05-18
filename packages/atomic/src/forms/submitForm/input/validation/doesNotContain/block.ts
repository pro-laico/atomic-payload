import { ValidationMessageField } from '@pro-laico/atomic/forms/fields/validationMessage'
import { APField } from '@pro-laico/core'
import type { Block } from 'payload'

export const IvDoesNotContain: Block = {
  slug: 'IvDoesNotContain',
  interfaceName: 'IvDoesNotContain',
  admin: { disableBlockName: true },
  labels: { singular: 'Does Not Contain', plural: 'Does Not Contain' },
  custom: { usedOn: ['text', 'textarea', 'email'] },
  fields: [APField({ type: 'text', apf: ['form'], name: 'doesNotContainValue' }), ValidationMessageField],
}
