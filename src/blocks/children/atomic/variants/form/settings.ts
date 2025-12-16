import { GroupField } from 'payload'
import { APField } from '@/fields/apf'

const d = {
  lm: 'Forms Loading Message',
  sm: 'Forms Default Success Message',
  em: 'Forms Default Error Message',
}

export const FormSettingsTab: GroupField = {
  type: 'group',
  label: 'Form Settings',
  admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'form') },
  fields: [
    APField({ type: 'checkbox', apf: ['form'], name: 'formToastEnabled', admin: { width: '25%' } }),
    APField({ type: 'text', apf: ['form'], name: 'lm', label: 'Loading Message', admin: { description: d.lm, width: '25%' } }),
    APField({ type: 'text', apf: ['form'], name: 'sm', label: 'Success Message', admin: { description: d.sm, width: '25%' } }),
    APField({ type: 'text', apf: ['form'], name: 'em', label: 'Error Message', admin: { description: d.em, width: '25%' } }),
  ],
}
