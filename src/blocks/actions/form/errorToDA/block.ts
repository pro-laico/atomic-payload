import type { Block } from 'payload'
import { APField } from '@/fields/apf'

const ds = {
  formName: 'The name of the front end form to use the response of.',
  inputName: 'The name of the input to listen for changes on. If empty, defaults to using the form level message.',
}

export const ActFormErrorToDA: Block = {
  slug: 'ActFormErrorToDA',
  admin: { group: 'Form' },
  interfaceName: 'ActFormErrorToDA',
  labels: { singular: 'Form Error To Data Attribute', plural: 'Form Error To Data Attribute' },
  fields: [
    APField({ type: 'text', apf: ['form', 'actions'], name: 'formName', admin: { description: ds.formName }, kebab: true }),
    APField({ type: 'text', apf: ['form', 'actions'], name: 'inputName', admin: { description: ds.inputName }, kebab: true }),
  ],
}
