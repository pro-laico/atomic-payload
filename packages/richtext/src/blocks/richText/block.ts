import { FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { ColoredEnd } from '@pro-laico/atomic/children/fields/coloredEnd'
import { ChildsSettingsTab } from '@pro-laico/atomic/children/fields/tabs/settings'
import { TrackingTab } from '@pro-laico/atomic/children/fields/trackingTab'
import type { BlockFieldExtensions } from '@pro-laico/core'
import type { Block } from 'payload'

/** Options for {@link createRichTextBlock}: generic fields to prepend/append to the Content tab. */
export type RichTextBlockOptions = BlockFieldExtensions

/**
 * Builds the `RichTextChild` block. `prependFields` / `appendFields` are spread
 * at the start / end of the Content tab — the consumer decides what goes there
 * (e.g. the `@pro-laico/styles` `ClassNameField`, project fields, or nothing),
 * so the block carries no CSS dependency of its own.
 */
export const createRichTextBlock = ({ prependFields = [], appendFields = [] }: RichTextBlockOptions = {}): Block => ({
  slug: 'RichTextChild',
  interfaceName: 'RichTextChild',
  labels: { singular: 'Rich Text', plural: 'Rich Texts' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            ...prependFields,
            {
              name: 'richText',
              type: 'richText',
              required: true,
              label: false,
              editor: lexicalEditor({
                admin: { hideGutter: true, hideInsertParagraphAtEnd: true },
                features: ({ rootFeatures }) => {
                  return [...rootFeatures, HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }), FixedToolbarFeature(), InlineToolbarFeature()]
                },
              }),
            },
            ...appendFields,
          ],
        },
        ChildsSettingsTab('RichTextChild'),
        TrackingTab,
      ],
    },
    ColoredEnd,
  ],
})

/** The default `RichTextChild` block, with no className field. */
export const RichText: Block = createRichTextBlock()
