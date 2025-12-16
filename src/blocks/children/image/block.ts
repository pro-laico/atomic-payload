import type { Block } from 'payload'
import { ColoredEnd } from '@/fields/coloredEnd'
import { TrackingTab } from '@/fields/tabs/block/children/tracking'
import { ClassNameField } from '@/fields/className'
import { ChildsSettingsTab } from '@/fields/tabs/block/children/settings'
import type { Image as ImageType } from '@/ts/types'

const d = {
  image: 'Select the image to be displayed.',
  quality: '0-100. Default is 75. Use 100 for best quality.',
  loading: 'Default is lazy. Use eager for images visible on load.',
  decoding: 'Default is async. Use sync for images visible on load.',
  imageClassName: 'Classes are added directly to the nextImage component.',
  size: 'If not set, will default to image width. Example: "100vw" or "100px".',
  fill: 'Default false. If true, the image will be resized to fill the parent container.',
  priority: 'Default false. If true, the asset will be pre-loaded and disable lazy loading.',
  alt: 'Defaults to alt set on the image asset. But you can add an alt for this instance here.',
  blur: 'Default false. If true, will use the automatically generated blur data URL for the image.',
  version: 'Select the stored version of the image you want to use. Leave blank for automatic optimization.',
  unoptimized: 'Default false. If true, will not optimize the image for the web. Best for tiny images like logos.',
}

const sizeOptions: { label: string; value: keyof NonNullable<ImageType['sizes']> }[] = [
  { label: 'Thumbnail', value: 'thumbnail' },
  { label: 'Square', value: 'square' },
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'XLarge', value: 'xlarge' },
  { label: 'OG', value: 'og' },
]

export const Image: Block = {
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
            {
              type: 'row',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'images', required: true, admin: { width: '50%', description: d.image } },
                { name: 'version', type: 'select', options: sizeOptions, admin: { width: '50%', description: d.version } },
              ],
            },
            { name: 'alt', type: 'textarea', admin: { description: d.alt } },
            ClassNameField({ label: 'Image Atomic Classes', admin: { description: d.imageClassName } }),
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
          ],
        },
        ChildsSettingsTab('ImageChild'),
        TrackingTab,
      ],
    },
    ColoredEnd,
  ],
}
