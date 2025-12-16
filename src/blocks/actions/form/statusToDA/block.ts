import type { Block } from 'payload'
import { APField } from '@/fields/apf'

const description = 'The name of the front end form to check the status of.'

export const ActFormStatusToDA: Block = {
  slug: 'ActFormStatusToDA',
  admin: { group: 'Form' },
  interfaceName: 'ActFormStatusToDA',
  labels: { singular: 'Form Status To DA', plural: 'Form Status To DA' },
  fields: [APField({ type: 'text', name: 'formName', apf: ['form', 'actions'], admin: { description }, kebab: true })],
}
