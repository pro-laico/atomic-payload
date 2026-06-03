import type { BlockFieldExtensions } from '@pro-laico/core'
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
}

/** Options for {@link createSimpleTextBlock}: generic fields to prepend/append to the Content tab. */
export type SimpleTextBlockOptions = BlockFieldExtensions

/**
 * Builds the `SimpleTextChild` block. `prependFields` / `appendFields` are
 * spread at the start / end of the Content tab — the consumer decides what
 * goes there (e.g. the `@pro-laico/styles` `ClassNameField`, project fields, or
 * nothing), so the block carries no CSS dependency of its own.
 */
export const createSimpleTextBlock = ({ prependFields = [], appendFields = [] }: SimpleTextBlockOptions = {}): Block => ({
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
            ...prependFields,
            TagTypeField({ childBlock: 'SimpleTextChild', width: '25%' }),
            ForField({ admin: { condition: (_data: unknown, sd: { tagType?: string }) => Boolean(sd?.tagType === 'label') } }),
            { name: `text`, type: 'textarea', required: true, admin: { description: ds.text } },
            ...appendFields,
          ],
        },
        { label: 'Actions', fields: [ContentActionsTab] },
        ChildsSettingsTab('SimpleTextChild'),
        TrackingTab,
      ],
    },
    ColoredEnd,
  ],
})

/** The default `SimpleTextChild` block, with no className field. */
export const SimpleText: Block = createSimpleTextBlock()
