import { APField } from '@/fields/apf'
import type { TextField } from 'payload'

const description = "The message to display when the validation fails. Use {{inputName}} to display the input's value."

/** Used in form SVR block fields to set the validation message. */
export const ValidationMessageField: TextField = APField({
  type: 'text',
  apf: ['form'],
  required: true,
  admin: { description },
  name: 'validationMessage',
})
