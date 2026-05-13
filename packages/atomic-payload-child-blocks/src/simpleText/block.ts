import type { Block } from 'payload'
import { ForField } from 'atomic-payload/child-blocks-deps'
import { SimpleTextLabelPath } from 'atomic-payload/child-blocks-deps'
import { TagTypeField } from 'atomic-payload/child-blocks-deps'
import { ColoredEnd } from 'atomic-payload/child-blocks-deps'
import { ClassNameField } from 'atomic-payload/child-blocks-deps'
import { TrackingTab } from 'atomic-payload/child-blocks-deps'
import { ContentActionsTab } from 'atomic-payload/child-blocks-deps'
import { ChildsSettingsTab } from 'atomic-payload/child-blocks-deps'

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
            ClassNameField({ admin: { description: ds.className, condition: (_data: unknown, sd: { tagType?: string }) => Boolean(sd?.tagType !== 'fragment') } }),
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
