import type { Block } from 'payload'
import { APField } from '@/fields/apf'

export const ActSubmitForm: Block = {
  slug: 'ActSubmitForm',
  admin: { group: 'Form' },
  interfaceName: 'ActSubmitForm',
  labels: { singular: 'Submit Form', plural: 'Submit Form' },
  fields: [
    APField({
      type: 'text',
      name: 'formName',
      apf: ['form', 'actions'],
      admin: { description: 'The name of the front end form to submit.' },
      kebab: true,
    }),
  ],
}
