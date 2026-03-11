import type { Block } from 'payload'
import { ColoredEnd } from '@/fields/coloredEnd'
import { TrackingTab } from '@/fields/tabs/block/children/tracking'
import { ClassNameField } from '@/fields/className'
import { ChildsSettingsTab } from '@/fields/tabs/block/children/settings'

const d = {
  svgAtomicClasses: 'Add atomic classes or shortcuts to the svg element here.',
  ariaHidden: 'If true, the element will be hidden from screen readers.',
  viewbox: 'SVG viewbox attribute. Example: "0 0 24 24".',
  fill: 'SVG fill attribute. Example: "currentColor" or "#000000".',
  contents: 'SVG content/path data.',
}

export const SVGBlock: Block = {
  slug: 'SVGChild',
  interfaceName: 'SVGChild',
  labels: { singular: 'SVG', plural: 'SVGs' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            ClassNameField({ label: 'SVG Atomic Classes', admin: { description: d.svgAtomicClasses } }),
            { name: 'ariaHidden', type: 'checkbox', admin: { description: d.ariaHidden } },
            { name: 'viewBox', type: 'text', required: true, admin: { description: d.viewbox } },
            { name: 'fill', type: 'text', admin: { description: d.fill } },
            { name: 'contents', type: 'textarea', required: true, admin: { description: d.contents } },
          ],
        },
        ChildsSettingsTab('SVGChild'),
        TrackingTab,
      ],
    },
    ColoredEnd,
  ],
}
