import { ForField } from '@/fields/for'
import type { GroupField } from 'payload'

export const TagSettingsTab: GroupField = {
  type: 'group',
  label: 'Tag Settings',
  admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'tag') },
  fields: [ForField({ admin: { condition: (_, sd) => Boolean(sd?.tagType === 'label') } })],
}
