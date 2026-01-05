import { SelectField } from 'payload'
import { APField } from '@/fields/apf'

export const ButtonTypeField: SelectField = APField({
  name: 'buttonType',
  apf: ['actions'],
  type: 'select',
  required: true,
  interfaceName: 'AtomicButtonTypes',
  admin: { condition: (_, sd) => Boolean(sd?.type === 'button'), width: '25%' },
  options: [
    { label: 'Link', value: 'link' },
    { label: 'Regular', value: 'regular' },
    { label: 'Open Portal', value: 'portal' },
  ],
})
