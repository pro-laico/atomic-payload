import type { Block } from 'payload'
import { APField } from '@pro-laico/atomic-payload-apf'
import { ValidationMessageField } from '@pro-laico/atomic-payload-forms/fields/validationMessage'

export const IvDoesNotContain: Block = {
  slug: 'IvDoesNotContain',
  interfaceName: 'IvDoesNotContain',
  admin: { disableBlockName: true },
  labels: { singular: 'Does Not Contain', plural: 'Does Not Contain' },
  custom: { usedOn: ['text', 'textarea', 'email'] },
  fields: [APField({ type: 'text', apf: ['form'], name: 'doesNotContainValue' }), ValidationMessageField],
}
