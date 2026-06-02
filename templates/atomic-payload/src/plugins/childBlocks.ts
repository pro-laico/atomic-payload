import { childBlocksPlugin } from '@pro-laico/atomic/children'
import { ClassNameField } from '@pro-laico/styles'

// The block packages (icons / images / mux-video / richtext) and the atomic
// SimpleText block no longer hard-depend on @pro-laico/styles. Each exposes
// generic `prependFields` / `appendFields` on the start/end of its primary
// content tab; this is where the project chooses to weave the ClassNameField
// (or any other field) in. `AtomicChild` is a special case and still takes the
// ClassNameField directly via `classNameField`.
//
// Pass `childBlocks: [myBlock, …]` to append more blocks alongside the defaults.
export const childBlocksPluginConfig = childBlocksPlugin({
  enabled: true,
  classNameField: ClassNameField,
  blockFields: {
    SimpleTextChild: {
      prependFields: [
        ClassNameField({
          admin: {
            description: 'Add atomic classes or shortcuts to the simple text element here.',
            condition: (_data: unknown, sd: { tagType?: string }) => Boolean(sd?.tagType !== 'fragment'),
          },
        }),
      ],
    },
    RichTextChild: {
      prependFields: [
        ClassNameField({
          label: 'Rich Text Atomic Classes',
          defaultValue: 'prose dark:prose-invert',
          admin: {
            description:
              "Add the class 'prose' to apply tag based styles to rich text content. Supports suffixes '-sm', '-base', '-lg', '-xl', '-2xl'",
          },
        }),
      ],
    },
    ImageChild: {
      prependFields: [
        ClassNameField({ label: 'Image Atomic Classes', admin: { description: 'Classes are added directly to the nextImage component.' } }),
      ],
    },
    VideoChild: {
      prependFields: [
        ClassNameField({
          label: 'Video Atomic Classes',
          defaultValue: 'relative flex max-w-full aspect-video overflow-hidden',
          admin: { description: 'It is recommended to use this inside a tag component that controls sizing, use the default value.' },
        }),
      ],
    },
    IconChild: {
      prependFields: [
        ClassNameField({
          label: 'SVG Atomic Classes',
          admin: { description: 'Styles applied directly on the svg. If left empty, defaults to 100% width and height.', width: '100%' },
        }),
      ],
    },
    SVGChild: {
      prependFields: [
        ClassNameField({ label: 'SVG Atomic Classes', admin: { description: 'Add atomic classes or shortcuts to the svg element here.' } }),
      ],
    },
  },
})
