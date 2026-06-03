import type { Block } from 'payload'

import { ColoredEnd } from '@pro-laico/atomic/children/fields/coloredEnd'
import { TrackingTab } from '@pro-laico/atomic/children/fields/trackingTab'
import type { BlockFieldExtensions } from '@pro-laico/core'
import { ChildsSettingsTab } from '@pro-laico/atomic/children/fields/tabs/settings'

const d = {
  ariaHidden: 'If true, the element will be hidden from screen readers.',
  viewbox: 'SVG viewbox attribute. Example: "0 0 24 24".',
  fill: 'SVG fill attribute. Example: "currentColor" or "#000000".',
  contents: 'SVG content/path data.',
}

/** Options for {@link createSvgBlock}: generic fields to prepend/append to the Content tab. */
export type SvgBlockOptions = BlockFieldExtensions

/**
 * Builds the `SVGChild` block. `prependFields` / `appendFields` are spread at
 * the start / end of the Content tab — the consumer decides what goes there
 * (e.g. the `@pro-laico/styles` `ClassNameField`, project fields, or nothing),
 * so the block carries no CSS dependency of its own.
 */
export const createSvgBlock = ({ prependFields = [], appendFields = [] }: SvgBlockOptions = {}): Block => ({
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
            ...prependFields,
            { name: 'ariaHidden', type: 'checkbox', admin: { description: d.ariaHidden } },
            { name: 'viewBox', type: 'text', required: true, admin: { description: d.viewbox } },
            { name: 'fill', type: 'text', admin: { description: d.fill } },
            { name: 'contents', type: 'textarea', required: true, admin: { description: d.contents } },
            ...appendFields,
          ],
        },
        ChildsSettingsTab('SVGChild'),
        TrackingTab,
      ],
    },
    ColoredEnd,
  ],
})

/** The default `SVGChild` block, with no className field. */
export const SVGBlock: Block = createSvgBlock()
