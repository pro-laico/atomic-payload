import { ClassNameField } from '@pro-laico/core'
import type { Block } from 'payload'
import { SimpleTextRowLabelPath as SimpleTextLabelPath } from '../components/admin'
import { ColoredEnd } from '../fields/coloredEnd'
import { ForField } from '../fields/for'
import { ContentActionsTab } from '../fields/tabs/actions'
import { ChildsSettingsTab } from '../fields/tabs/settings'
import { TagTypeField } from '../fields/tagType'
import { TrackingTab } from '../fields/trackingTab'

const ds = {
  text: 'The text content to display. Use {{data attribute name}} to display the data attributes value.',
  className: 'Add atomic classes or shortcuts to the simple text element here.',
}

export const SimpleText: Block = {
  slug: 'SimpleTextChild',
  interfaceName: 'SimpleTextChild',
  labels: { singular: '"Simple" Text', plural: '"Simple" Texts' },
  admin: { components: { Label: { path: SimpleTextLabelPath } } },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            TagTypeField({ childBlock: 'SimpleTextChild', width: '25%' }),
            ClassNameField({
              admin: { description: ds.className, condition: (_data: unknown, sd: { tagType?: string }) => Boolean(sd?.tagType !== 'fragment') },
            }),
            ForField({ admin: { condition: (_data: unknown, sd: { tagType?: string }) => Boolean(sd?.tagType === 'label') } }),
            { name: `text`, type: 'textarea', required: true, admin: { description: ds.text } },
          ],
        },
        { label: 'Actions', fields: [ContentActionsTab] },
        ChildsSettingsTab('SimpleTextChild'),
        TrackingTab,
      ],
    },
    ColoredEnd,
  ],
}
