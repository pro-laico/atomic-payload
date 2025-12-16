import type { Block } from 'payload'
import { ForField } from '@/fields/for'
import { SimpleTextLabelPath } from '@/ui'
import { TagTypeField } from '@/fields/tagType'
import { ColoredEnd } from '@/fields/coloredEnd'
import { ClassNameField } from '@/fields/className'
import { TrackingTab } from '@/fields/tabs/block/children/tracking'
import { ContentActionsTab } from '@/fields/tabs/block/children/actions'
import { ChildsSettingsTab } from '@/fields/tabs/block/children/settings'

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
            ClassNameField({ admin: { description: ds.className, condition: (_, sd) => Boolean(sd?.tagType !== 'fragment') } }),
            ForField({ admin: { condition: (_, sd) => Boolean(sd?.tagType === 'label') } }),
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
