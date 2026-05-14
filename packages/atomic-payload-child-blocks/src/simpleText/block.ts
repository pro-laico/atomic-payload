import type { Block } from 'payload'
import { ForField } from '../fields/for'
import { TagTypeField } from '../fields/tagType'
import { TrackingTab } from '../fields/trackingTab'
import { SimpleTextLabelPath, ClassNameField } from 'atomic-payload/child-blocks-deps'
import { ColoredEnd } from '../fields/coloredEnd'
import { ContentActionsTab } from '../fields/tabs/actions'
import { ChildsSettingsTab } from '../fields/tabs/settings'

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
