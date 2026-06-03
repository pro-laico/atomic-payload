import { IconSelectPath } from '@pro-laico/atomic/children/admin'
import { ColoredEnd } from '@pro-laico/atomic/children/fields/coloredEnd'
import { ChildsSettingsTab } from '@pro-laico/atomic/children/fields/tabs/settings'
import { TrackingTab } from '@pro-laico/atomic/children/fields/trackingTab'
import type { BlockFieldExtensions } from '@pro-laico/core'
import type { Block } from 'payload'

const d = {
  icon: 'Select an icon to display.',
  ariaHidden: 'If checked, the icon will be hidden to screen readers. This is useful if you want to use the icon for decorative purposes only.',
}

/** Options for {@link createIconBlock}: generic fields to prepend/append to the Icon tab. */
export type IconBlockOptions = BlockFieldExtensions

/**
 * Builds the `IconChild` block. `prependFields` / `appendFields` are spread at
 * the start / end of the Icon tab — the consumer decides what goes there (e.g.
 * the `@pro-laico/styles` `ClassNameField`, project fields, or nothing), so the
 * block carries no CSS dependency of its own.
 */
export const createIconBlock = ({ prependFields = [], appendFields = [] }: IconBlockOptions = {}): Block => ({
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
            ...prependFields,
            {
              type: 'row',
              fields: [
                // Stores the icon *name* as a string (resolved against the active
                // IconSet at render time), deliberately — not an `upload`/relationship.
                // Trade-off: no referential integrity, so renaming/deleting an icon
                // leaves the stored name stale; and it's intentionally not `required`
                // so a block can be saved before its icon is picked.
                { name: `icon`, type: 'text', admin: { width: '50%', components: { Field: { path: IconSelectPath } } } },
                { name: 'ariaHidden', type: 'checkbox', admin: { width: '50%', description: d.ariaHidden } },
              ],
            },
            ...appendFields,
          ],
        },
        ChildsSettingsTab('IconChild'),
        TrackingTab,
      ],
    },
    ColoredEnd,
  ],
})

/** The default `IconChild` block, with no className field. */
export const Icon: Block = createIconBlock()
