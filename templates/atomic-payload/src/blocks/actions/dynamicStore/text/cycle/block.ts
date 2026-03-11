import type { Block } from 'payload'
import { APField } from '@/fields/apf'
import { KeyTextField } from '@/fields/actions'
import { InitialValueCheckboxField, PersistedField, SetDataField } from '@/fields/actions'

export const ActDSCycleText: Block = {
  slug: 'ActDSCycleText',
  interfaceName: 'ActDSCycleText',
  admin: { group: 'Dynamic Store' },
  labels: { singular: 'Cycle Text', plural: 'Cycle Text' },
  fields: [
    {
      type: 'group',
      label: 'Settings',
      admin: { hideGutter: true },
      fields: [
        {
          type: 'row',
          fields: [KeyTextField({ admin: { width: '25%' } }), PersistedField({ admin: { width: '25%' } }), SetDataField({ admin: { width: '25%' } })],
        },
      ],
    },
    {
      name: 'textArray',
      type: 'array',
      label: 'Values',
      required: true,
      minRows: 2,
      fields: [
        InitialValueCheckboxField({ admin: { width: '25%' } }),
        APField({
          name: 'value',
          type: 'text',
          apf: ['actions'],
          required: true,
          admin: { width: '75%', description: 'The value to set the key to.' },
        }),
      ],
    },
  ],
}
