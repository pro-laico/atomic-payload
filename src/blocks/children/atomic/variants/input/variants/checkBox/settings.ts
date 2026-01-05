import { APField } from '@/fields/apf'
import type { GroupField } from 'payload'

export const CheckboxSettingsTab: GroupField = {
  type: 'group',
  label: 'Checkbox Settings',
  admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'input' && sd?.inputType === 'checkbox') },
  fields: [APField({ type: 'checkbox', apf: ['form'], name: 'checkboxDefault' })],
}
