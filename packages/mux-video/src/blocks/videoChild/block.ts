import { ColoredEnd } from '@pro-laico/atomic/children/fields/coloredEnd'
import { ChildsSettingsTab } from '@pro-laico/atomic/children/fields/tabs/settings'
import { TagTypeField } from '@pro-laico/atomic/children/fields/tagType'
import { TrackingTab } from '@pro-laico/atomic/children/fields/trackingTab'
import type { BlockFieldExtensions } from '@pro-laico/core'
import type { Block } from 'payload'

const d = {
  video: 'Select the video to be displayed.',
  quality: 'Default is 1. The quality of the video.',
  blur: 'Default is 20. The blur amount of the video.',
  loop: 'Default is false. If true, the video will loop.',
  muted: 'Default is false. If true, the video will be muted.',
  preload: 'Default is metadata. Controls when the video starts loading.',
  time: 'Default is 0. The time in the video, the blur image will be generated from.',
  disableBlur: 'Default is false. If true, the video will not use the blur data URL.',
  autoplay: 'Default is false. If true, the video will autoplay, which also forces muted to be true.',
}

/** Options for {@link createVideoBlock}: generic fields to prepend/append to the Video tab. */
export type VideoBlockOptions = BlockFieldExtensions

/**
 * Builds the `VideoChild` block. `prependFields` / `appendFields` are spread at
 * the start / end of the Video tab — the consumer decides what goes there (e.g.
 * the `@pro-laico/styles` `ClassNameField`, project fields, or nothing), so the
 * block carries no CSS dependency of its own.
 */
export const createVideoBlock = ({ prependFields = [], appendFields = [] }: VideoBlockOptions = {}): Block => ({
  slug: 'VideoChild',
  interfaceName: 'VideoChild',
  labels: { singular: 'Video', plural: 'Videos' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Video',
          fields: [
            ...prependFields,
            {
              type: 'row',
              fields: [
                TagTypeField({ childBlock: 'VideoChild', width: '25%' }),
                {
                  name: 'video',
                  label: 'Mux Video',
                  type: 'relationship',
                  relationTo: 'mux-video',
                  required: true,
                  index: true,
                  admin: { width: '25%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'preload',
                  type: 'select',
                  options: ['none', 'metadata', 'auto'],
                  required: true,
                  defaultValue: 'metadata',
                  admin: { width: '20%', description: d.preload },
                },
                { name: 'autoplay', type: 'checkbox', defaultValue: false, admin: { width: '20%', description: d.autoplay } },
                { name: 'loop', type: 'checkbox', defaultValue: false, admin: { width: '20%', description: d.loop } },
                { name: 'muted', type: 'checkbox', defaultValue: false, admin: { width: '20%', description: d.muted } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'disableBlur', type: 'checkbox', defaultValue: false, admin: { width: '25%', description: d.disableBlur } },
                { name: 'time', type: 'number', defaultValue: 0, admin: { width: '25%', description: d.time } },
                { name: 'blur', type: 'number', min: 0, max: 100, defaultValue: 20, admin: { width: '25%', description: d.blur } },
                { name: 'quality', type: 'number', min: 0.25, max: 10, defaultValue: 1, admin: { width: '25%', description: d.quality } },
              ],
            },
            ...appendFields,
          ],
        },
        ChildsSettingsTab('VideoChild'),
        TrackingTab,
      ],
    },
    ColoredEnd,
  ],
})

/** The default `VideoChild` block, with no className field. */
export const Video: Block = createVideoBlock()
