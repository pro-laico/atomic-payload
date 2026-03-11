import type { GroupField } from 'payload'
import { ModalField } from '@/fields/modal'
import { DefaultOpenField } from '@/fields/defaultOpen'
import { KeepMountedField } from '@/fields/keepMounted'

const popd = {
  side: 'The side of the portal.',
  align: 'The alignment of the portal.',
  sideOffset: 'The offset of the portal.',
  alignOffset: 'The offset of the portal.',
  arrowPadding: 'The padding in pixels for the arrow.',
  positionMethod: 'Determines which CSS position property to use.',
  sticky: 'If checked, the portal will be sticky to the top of the screen.',
  trackAnchor: 'If checked, the portal will track the anchor of the parent element.',
}

export const PositionerSettingsField: GroupField = {
  type: 'group',
  admin: { hideGutter: true },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'sticky', type: 'checkbox', admin: { description: popd.sticky, style: { maxWidth: '250px' } } },
        { name: 'trackAnchor', type: 'checkbox', admin: { description: popd.trackAnchor, style: { maxWidth: '250px' } } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'side',
          type: 'select',
          options: [
            { label: 'Top', value: 'top' },
            { label: 'Bottom', value: 'bottom' },
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
          admin: { width: '25%', description: popd.side },
        },
        { name: 'sideOffset', type: 'number', admin: { width: '25%', description: popd.sideOffset } },
        {
          name: 'align',
          type: 'select',
          options: [
            { label: 'Center', value: 'center' },
            { label: 'Start', value: 'start' },
            { label: 'End', value: 'end' },
          ],
          admin: { width: '25%', description: popd.align },
        },
        { name: 'alignOffset', type: 'number', admin: { width: '25%', description: popd.alignOffset } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'positionMethod',
          type: 'select',
          options: [
            { label: 'Absolute', value: 'absolute' },
            { label: 'Fixed', value: 'fixed' },
          ],
          admin: { width: '25%', description: popd.positionMethod },
        },
        { name: 'arrowPadding', type: 'number', admin: { width: '25%', description: popd.arrowPadding } },
      ],
    },
  ],
}

const d = {
  side: 'The side of the popover.',
  modal: 'If checked, the popover will be a modal.',
  hasArrow: 'If checked, the popover will have an arrow.',
  openOnHover: 'If checked, the popover will open on hover.',
  closeDelay: 'The delay in milliseconds before the popover closes.',
  keepMounted: 'If checked, the popover will stay mounted when closed.',
  delay: 'The delay in milliseconds before the popover opens. Useful to adjust when open on hover is true.',
}

//TODO: add starting and end styles to assist with animations
export const PopoverSettingsTab: GroupField = {
  type: 'group',
  name: 'pops',
  label: 'Popover Settings',
  interfaceName: 'PopoverSettings',
  admin: { hideGutter: true, condition: (_, sd) => Boolean(sd?.type === 'button' && sd?.buttonType === 'portal' && sd?.portalType === 'popover') },
  fields: [
    {
      type: 'row',
      fields: [
        DefaultOpenField({ admin: { width: '25%' } }),
        { name: 'openOnHover', type: 'checkbox', admin: { width: '25%', description: d.openOnHover } },
        { name: 'hasArrow', type: 'checkbox', admin: { style: { maxWidth: '250px' }, description: d.hasArrow } },
        KeepMountedField({ admin: { style: { maxWidth: '250px' } } }),
        {
          type: 'row',
          fields: [
            ModalField({ admin: { width: '50%' } }),
            { name: 'delay', type: 'number', label: 'Open Delay', admin: { width: '25%', description: d.delay } },
            { name: 'closeDelay', type: 'number', label: 'Close Delay', admin: { width: '25%', description: d.closeDelay } },
          ],
        },
        PositionerSettingsField,
      ],
    },
  ],
}
