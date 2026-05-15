import type { Block } from 'payload'
import { TrackingTab } from '@pro-laico/atomic/children/fields/trackingTab'
import { ClassNameField } from '@pro-laico/ap-core'
import { ColoredEnd } from '@pro-laico/atomic/children/fields/coloredEnd'
import { ChildsSettingsTab } from '@pro-laico/atomic/children/fields/tabs/settings'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { FixedToolbarFeature, HeadingFeature, InlineToolbarFeature } from '@payloadcms/richtext-lexical'

const d = {
  richTextAtomicClasses:
    "Add the class 'prose' to apply tag based styles to rich text content. Supports suffixes '-sm', '-base', '-lg', '-xl', '-2xl'",
}

export const RichText: Block = {
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
            ClassNameField({
              label: 'Rich Text Atomic Classes',
              defaultValue: 'prose dark:prose-invert',
              admin: { description: d.richTextAtomicClasses },
            }),
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
          ],
        },
        ChildsSettingsTab('RichTextChild'),
        TrackingTab,
      ],
    },
    ColoredEnd,
  ],
}
