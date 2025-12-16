import type { Block } from 'payload'
import { SetDataField } from '@/fields/actions'
import { APField } from '@/fields/apf'

export const ActSetPortalOpen: Block = {
  slug: 'ActSetPortalOpen',
  admin: { group: 'Portal' },
  interfaceName: 'ActSetPortalOpen',
  labels: { singular: 'Set Portal Open', plural: 'Set Portal Open' },
  fields: [
    {
      type: 'row',
      fields: [
        APField({
          type: 'text',
          name: 'portal',
          apf: ['actions'],
          admin: { description: 'The name of the portal to toggle.', width: '25%' },
          kebab: true,
        }),
        SetDataField(),
      ],
    },
  ],
}
