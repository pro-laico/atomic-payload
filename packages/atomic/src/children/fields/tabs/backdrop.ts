import type { GroupField } from 'payload'
import type { ClassNameFieldWrapper } from '@pro-laico/core'

import { BackdropChildren } from '../blocks/backdropChildren'

const d = {
  className: 'Add atomic classes or shortcuts to the portal backdrop div here.',
}

/** Options for {@link createPortalBackdropTab}. */
export interface PortalBackdropTabOptions {
  /**
   * The `@pro-laico/styles` `ClassNameField` (or a compatible wrapper). When
   * supplied, a `backdrop`-prefixed atomic classes textarea is prepended to the
   * backdrop group. Omit it (the default) to ship the group without any CSS
   * dependency.
   */
  classNameField?: ClassNameFieldWrapper
}

/**
 * Builds the portal backdrop group. Decoupled from `@pro-laico/styles`: pass
 * `classNameField` (threaded in via `ChildsSettingsTab('AtomicChild', …)`) to
 * add the atomic classes field; without it the group carries no className field.
 */
export const createPortalBackdropTab = ({ classNameField }: PortalBackdropTabOptions = {}): GroupField => ({
  type: 'group',
  label: 'Portal Backdrop',
  admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'button' && sd?.buttonType === 'portal') },
  fields: [
    ...(classNameField
      ? [classNameField({ namePrefix: 'backdrop', label: 'Portal Backdrop Atomic Classes', admin: { description: d.className } })]
      : []),
    BackdropChildren,
  ],
})

/** The default portal backdrop group, with no className field. */
export const PortalBackdropTab: GroupField = createPortalBackdropTab()
