import { APField } from '@/fields/apf'
import type { GroupField } from 'payload'

export const RadioSettingsTab: GroupField = {
  type: 'group',
  label: 'Radio Settings',
  admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'input' && sd?.inputType === 'radio') },
  fields: [APField({ type: 'checkbox', apf: ['form'], name: 'radioDefault' }), APField({ type: 'text', apf: ['form'], name: 'radioValue' })],
}
