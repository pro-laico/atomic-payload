import { TextField } from 'payload'
import { APField } from '@/fields/apf'

const backendFormField: TextField = APField({
  type: 'text',
  apf: ['form'],
  name: 'backendForm',
  required: true,
  label: 'Backend Form To Use:',
  admin: { condition: (_, sd) => Boolean(sd?.type === 'form'), width: '25%' },
})

const formNameField: TextField = APField({
  type: 'text',
  apf: ['form', 'actions'],
  name: 'formName',
  kebab: true,
  required: true,
  admin: { condition: (_, sd) => Boolean(sd?.type === 'form'), width: '25%' },
})

export const FormFields: [TextField, TextField] = [backendFormField, formNameField]
