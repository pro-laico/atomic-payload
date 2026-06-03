import { ColoredEnd } from '@pro-laico/atomic/children/fields/coloredEnd'
import { ChildsSettingsTab } from '@pro-laico/atomic/children/fields/tabs/settings'
import { TrackingTab } from '@pro-laico/atomic/children/fields/trackingTab'
import type { BlockFieldExtensions } from '@pro-laico/core'
import type { Block } from 'payload'

import type { Image as ImageType } from '../../types/payload-augment'

const d = {
  image: 'Select the image to be displayed.',
  quality: '0-100. Default is 75. Use 100 for best quality.',
  loading: 'Default is lazy. Use eager for images visible on load.',
  decoding: 'Default is async. Use sync for images visible on load.',
  size: 'If not set, will default to image width. Example: "100vw" or "100px".',
  fill: 'Default false. If true, the image will be resized to fill the parent container.',
  priority: 'Default false. If true, the asset will be pre-loaded and disable lazy loading.',
  alt: 'Defaults to alt set on the image asset. But you can add an alt for this instance here.',
  blur: 'Default false. If true, will use the automatically generated blur data URL for the image.',
  version: 'Select the stored version of the image you want to use. Leave blank for automatic optimization.',
  unoptimized: 'Default false. If true, will not optimize the image for the web. Best for tiny images like logos.',
}

const sizeOptions: { label: string; value: Extract<keyof NonNullable<ImageType['sizes']>, string> }[] = [
  { label: 'Thumbnail', value: 'thumbnail' },
  { label: 'Square', value: 'square' },
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'XLarge', value: 'xlarge' },
  { label: 'OG', value: 'og' },
]

/** Options for {@link createImageBlock}: generic fields to prepend/append to the Image tab. */
export type ImageBlockOptions = BlockFieldExtensions

/**
 * Builds the `ImageChild` block. `prependFields` / `appendFields` are spread at
 * the start / end of the Image tab — the consumer decides what goes there (e.g.
 * the `@pro-laico/styles` `ClassNameField`, project fields, or nothing), so the
 * block carries no CSS dependency of its own.
 */
export const createImageBlock = ({ prependFields = [], appendFields = [] }: ImageBlockOptions = {}): Block => ({
  slug: 'ImageChild',
  interfaceName: 'ImageChild',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Image',
          fields: [
            ...prependFields,
            {
              type: 'row',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'images', required: true, admin: { width: '50%', description: d.image } },
                { name: 'version', type: 'select', options: sizeOptions, admin: { width: '50%', description: d.version } },
              ],
            },
            { name: 'alt', type: 'textarea', admin: { description: d.alt } },
            {
              type: 'row',
              fields: [
                { name: 'priority', type: 'checkbox', admin: { width: '25%', description: d.priority } },
                { name: 'blur', type: 'checkbox', admin: { width: '25%', description: d.blur } },
                { name: 'unoptimized', type: 'checkbox', admin: { width: '25%', description: d.unoptimized } },
                { name: 'fill', type: 'checkbox', admin: { width: '25%', description: d.fill } },
                {
                  name: 'loading',
                  type: 'select',
                  defaultValue: 'lazy',
                  options: ['lazy', 'eager'],
                  admin: { width: '25%', description: d.loading },
                },
                { name: 'decoding', type: 'select', options: ['auto', 'sync', 'async'], admin: { width: '25%', description: d.decoding } },
                { name: 'size', type: 'text', admin: { width: '25%', description: d.size } },
                { name: 'quality', type: 'number', min: 0, max: 100, admin: { width: '25%', description: d.quality } },
              ],
            },
            ...appendFields,
          ],
        },
        ChildsSettingsTab('ImageChild'),
        TrackingTab,
      ],
    },
    ColoredEnd,
  ],
})

/** The default `ImageChild` block, with no className field. */
export const Image: Block = createImageBlock()
