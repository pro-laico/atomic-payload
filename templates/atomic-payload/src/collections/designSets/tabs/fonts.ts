import { type Tab } from 'payload'
import { APField } from '@/fields/apf'
import { DesignTokenLabelPath } from '@/ui'
import { onArraySetAPFShallow } from '@/hooks/field/apf'
import { TokenValueArrayField } from '@/fields/designSets/value'

export const FontsTab = () => {
  const fontsField: Tab = {
    label: 'Fonts',
    admin: { description: 'These are the fonts that are applied to the entire website.' },
    fields: [
      {
        name: 'font',
        type: 'group',
        admin: { hideGutter: true },
        fields: [
          {
            type: 'row',
            fields: [
              { name: 'sans', type: 'upload', relationTo: 'font' },
              { name: 'serif', type: 'upload', relationTo: 'font' },
            ],
          },
          {
            type: 'row',
            fields: [
              { name: 'mono', type: 'upload', relationTo: 'font' },
              { name: 'display', type: 'upload', relationTo: 'font' },
            ],
          },
        ],
      },
      {
        type: 'array',
        name: 'text',
        label: 'Text',
        admin: { components: { RowLabel: { path: DesignTokenLabelPath } } },
        fields: [
          APField({ type: 'text', apf: ['classes'], name: 'name', required: true, kebab: true }),
          APField({ type: 'text', apf: ['classes'], name: 'fontSize', required: true }),
          APField({ type: 'text', apf: ['classes'], name: 'lineHeight', required: true }),
        ],
        hooks: { beforeValidate: [onArraySetAPFShallow(['classes'])] },
      },
      TokenValueArrayField('fontWeight'),
      TokenValueArrayField('tracking'),
      TokenValueArrayField('leading'),
      TokenValueArrayField('textStrokeWidth'),
    ],
  }

  return fontsField
}
