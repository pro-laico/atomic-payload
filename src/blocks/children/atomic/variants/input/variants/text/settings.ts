import { APField } from '@/fields/apf'
import type { GroupField } from 'payload'

export const TextSettingsTab: GroupField = {
  type: 'group',
  label: 'Text Settings',
  admin: {
    hideGutter: true,
    condition: (_, sd) => Boolean(sd?.type === 'input' && (sd?.inputType === 'text' || sd?.inputType === 'textarea' || sd?.inputType === 'email')),
  },
  fields: [APField({ type: 'textarea', apf: ['form'], name: 'textPlaceholder' }), APField({ type: 'textarea', apf: ['form'], name: 'textDefault' })],
}
