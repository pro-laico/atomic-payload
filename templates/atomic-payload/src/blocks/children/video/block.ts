import type { Block } from 'payload'
import { TagTypeField } from '@/fields/tagType'
import { ColoredEnd } from '@/fields/coloredEnd'
import { ClassNameField } from '@/fields/className'
import { TrackingTab } from '@/fields/tabs/block/children/tracking'
import { ChildsSettingsTab } from '@/fields/tabs/block/children/settings'

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
  className: 'It is recommended to use this inside a tag component that controls sizing, use the default value.',
}

export const Video: Block = {
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
            ClassNameField({
              admin: { description: d.className },
              label: 'Video Atomic Classes',
              defaultValue: 'relative flex max-w-full aspect-video overflow-hidden',
            }),
            {
              type: 'row',
              fields: [
                TagTypeField({ childBlock: 'VideoChild', width: '25%' }),
                { name: 'video', label: 'Mux Video', type: 'relationship', relationTo: 'mux-video', required: true, admin: { width: '25%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'preload', type: 'select', options: ['none', 'metadata', 'auto'], admin: { width: '20%', description: d.preload } },
                { name: 'autoplay', type: 'checkbox', admin: { width: '20%', description: d.autoplay } },
                { name: 'loop', type: 'checkbox', admin: { width: '20%', description: d.loop } },
                { name: 'muted', type: 'checkbox', admin: { width: '20%', description: d.muted } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'disableBlur', type: 'checkbox', admin: { width: '25%', description: d.disableBlur } },
                { name: 'time', type: 'number', admin: { width: '25%', description: d.time } },
                { name: 'blur', type: 'number', min: 0, max: 100, admin: { width: '25%', description: d.blur } },
                { name: 'quality', type: 'number', min: 0.25, max: 10, admin: { width: '25%', description: d.quality } },
              ],
            },
          ],
        },
        ChildsSettingsTab('VideoChild'),
        TrackingTab,
      ],
    },
    ColoredEnd,
  ],
}
