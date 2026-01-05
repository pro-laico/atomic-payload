import { SelectField } from 'payload'
import { APField } from '@/fields/apf'

export const inputTypeOptions = [
  { label: 'Text', value: 'text', type: 'string' },
  { label: 'Textarea', value: 'textarea', type: 'string' },
  { label: 'Email', value: 'email', type: 'string' },
  { label: 'Number', value: 'number', type: 'number' },
  { label: 'Checkbox', value: 'checkbox', type: 'boolean' },
  { label: 'Radio', value: 'radio', type: 'boolean' },
]

export const inputTypeOptionsForFields = inputTypeOptions.map((inputType) => ({ label: inputType.label, value: inputType.value }))

export const InputTypeField: SelectField = APField({
  type: 'select',
  apf: ['form', 'actions'],
  name: 'inputType',
  required: true,
  interfaceName: 'AtomicInputTypes',
  options: inputTypeOptionsForFields,
  admin: { condition: (_, sd) => Boolean(sd?.type === 'input'), width: '25%' },
})
