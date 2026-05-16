import type { Block } from 'payload'
import { SetDataField } from '@pro-laico/atomic/actions/fields'
import { APField } from '@pro-laico/core'

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
