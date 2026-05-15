import type { Block } from 'payload'
import { TrackingTab } from '@pro-laico/children/fields/trackingTab'
import { IconSelectPath } from '@pro-laico/children/admin'
import { ClassNameField } from '@pro-laico/ap-core'
import { ColoredEnd } from '@pro-laico/children/fields/coloredEnd'
import { ChildsSettingsTab } from '@pro-laico/children/fields/tabs/settings'

const d = {
  icon: 'Select an icon to display.',
  ariaHidden: 'If checked, the icon will be hidden to screen readers. This is useful if you want to use the icon for decorative purposes only.',
  svgAtomicClasses: 'Styles applied directly on the svg. If left empty, defaults to 100% width and height.',
}

export const Icon: Block = {
  slug: 'IconChild',
  interfaceName: 'IconChild',
  labels: { singular: 'Icon', plural: 'Icons' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Icon',
          fields: [
            {
              type: 'row',
              fields: [
                { name: `icon`, type: 'text', admin: { width: '50%', components: { Field: { path: IconSelectPath } } } },
                { name: 'ariaHidden', type: 'checkbox', admin: { width: '50%', description: d.ariaHidden } },
              ],
            },
            ClassNameField({ label: 'SVG Atomic Classes', admin: { description: d.svgAtomicClasses, width: '100%' } }),
          ],
        },
        ChildsSettingsTab('IconChild'),
        TrackingTab,
      ],
    },
    ColoredEnd,
  ],
}
