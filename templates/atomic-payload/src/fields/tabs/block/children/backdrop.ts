import { GroupField } from 'payload'
import { ClassNameField } from '@/fields/className'
import { BackdropChildren } from '@/fields/blocks/backdropChildren'

const d = {
  className: 'Add atomic classes or shortcuts to the portal backdrop div here.',
}

export const PortalBackdropTab: GroupField = {
  type: 'group',
  label: 'Portal Backdrop',
  admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'button' && sd?.buttonType === 'portal') },
  fields: [
    ClassNameField({ namePrefix: 'backdrop', label: 'Portal Backdrop Atomic Classes', admin: { description: d.className } }),
    BackdropChildren,
  ],
}
