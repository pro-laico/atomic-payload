import { APField } from '@pro-laico/ap-core'
import type { GroupField } from 'payload'

export const NumberSettingsTab: GroupField = {
  type: 'group',
  label: 'Number Settings',
  admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'input' && sd?.inputType === 'number') },
  fields: [APField({ type: 'text', apf: ['form'], name: 'numberPlaceholder' }), APField({ type: 'number', apf: ['form'], name: 'numberDefault' })],
}
