import { TextField } from 'payload'
import { APField } from '@/fields/apf'

const inputName: TextField = APField({
  type: 'text',
  apf: ['form', 'actions'],
  name: 'inputName',
  required: true,
  kebab: true,
  admin: { width: '25%', condition: (_, sd) => Boolean(sd?.type === 'input') },
})

export const InputControlBar: [TextField] = [inputName]
