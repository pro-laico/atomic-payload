import type { Block } from 'payload'

import type { BlockFieldExtensions } from '@pro-laico/core'
import { ColoredEnd } from '@pro-laico/atomic/children/fields/coloredEnd'
import { ChildsSettingsTab } from '@pro-laico/atomic/children/fields/tabs/settings'

const d = {
  image: 'Select the image to be displayed.',
  aspectRatio: 'Display crop ratio, e.g. "16:9", "1:1", "4:3". Leave blank to use the image\'s natural ratio.',
  fit: 'How the image fills the box. "cover" crops to the focal point (default); others letterbox/scale.',
  quality: '0-100. Default is 75. Higher = better quality, larger files.',
  loading: 'Default is lazy. Use eager for images visible on load.',
  decoding: 'Default is async. Use sync for images visible on load.',
  size: 'The responsive `sizes` attribute, e.g. "(max-width: 768px) 100vw, 50vw". Defaults to a full-width set.',
  priority: 'Default false. If true, the image loads eagerly (use for above-the-fold images).',
  alt: 'Defaults to the alt set on the image asset; add an instance-specific alt here. Leave blank only for decorative images.',
  blur: 'Default true. Shows a low-res placeholder while the image loads. Uncheck to disable.',
}

/** Options for {@link createImageBlock}: generic fields to prepend/append to the Image tab. */
export type ImageBlockOptions = BlockFieldExtensions

/**
 * Builds the `ImageChild` block. Images render through the on-demand transform
 * endpoint as a responsive `<img>` (no `next/image`): pick a display `aspectRatio`
 * and `fit` and the frontend builds the right `srcset` for you, cropping to the
 * image's focal point. `prependFields` / `appendFields` are spread at the start /
 * end of the Image tab.
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
                { name: 'aspectRatio', type: 'text', admin: { width: '25%', description: d.aspectRatio } },
                {
                  name: 'fit',
                  type: 'select',
                  defaultValue: 'cover',
                  options: ['cover', 'contain', 'inside', 'outside', 'fill'],
                  admin: { width: '25%', description: d.fit },
                },
              ],
            },
            { name: 'alt', type: 'textarea', admin: { description: d.alt } },
            {
              type: 'row',
              fields: [
                { name: 'priority', type: 'checkbox', admin: { width: '25%', description: d.priority } },
                { name: 'blur', type: 'checkbox', defaultValue: true, admin: { width: '25%', description: d.blur } },
                {
                  name: 'loading',
                  type: 'select',
                  defaultValue: 'lazy',
                  options: ['lazy', 'eager'],
                  admin: { width: '25%', description: d.loading },
                },
                {
                  name: 'decoding',
                  type: 'select',
                  defaultValue: 'async',
                  options: ['auto', 'sync', 'async'],
                  admin: { width: '25%', description: d.decoding },
                },
                { name: 'size', type: 'text', admin: { width: '50%', description: d.size } },
                { name: 'quality', type: 'number', min: 0, max: 100, admin: { width: '50%', description: d.quality } },
              ],
            },
            ...appendFields,
          ],
        },
        ChildsSettingsTab('ImageChild'),
      ],
    },
    ColoredEnd,
  ],
})

/** The default `ImageChild` block, with no className field. */
export const Image: Block = createImageBlock()
