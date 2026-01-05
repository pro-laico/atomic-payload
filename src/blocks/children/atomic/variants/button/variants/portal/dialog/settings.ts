import type { GroupField } from 'payload'
import { ModalField } from '@/fields/modal'
import { DefaultOpenField } from '@/fields/defaultOpen'
import { KeepMountedField } from '@/fields/keepMounted'

//TODO: add starting and end styles to assist with animations
export const DialogSettingsTab: GroupField = {
  name: 'ds',
  type: 'group',
  label: 'Dialog Settings',
  interfaceName: 'DialogSettings',
  admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'button' && sd?.buttonType === 'portal' && sd?.portalType === 'dialog') },
  fields: [
    {
      type: 'row',
      fields: [
        DefaultOpenField({ admin: { width: '25%' } }),
        { name: 'dismissible', type: 'checkbox', admin: { width: '25%', description: 'If checked, the dialog will be dismissible.' } },
        KeepMountedField({ admin: { width: '25%' } }),
        ModalField({ admin: { width: '50%' } }),
      ],
    },
  ],
}
