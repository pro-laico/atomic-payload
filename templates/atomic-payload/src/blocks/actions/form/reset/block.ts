import type { Block } from 'payload'
import { APField } from '@/fields/apf'

export const ActResetForm: Block = {
  slug: 'ActResetForm',
  admin: { group: 'Form' },
  interfaceName: 'ActResetForm',
  labels: { singular: 'Reset Form', plural: 'Reset Form' },
  fields: [
    APField({
      type: 'text',
      name: 'formName',
      apf: ['form', 'actions'],
      admin: { description: 'The name of the front end form to reset.' },
      kebab: true,
    }),
  ],
}
