import type { TabAsField } from 'payload'

export const googleTagManagerTabField = (): TabAsField => ({
  type: 'tab',
  label: 'Google Tag Manager',
  admin: { condition: (_, sd) => Boolean(sd?.googleTagManagerEnabled) },
  fields: [
    {
      name: 'googleTagManagerId',
      type: 'text',
      label: 'Google Tag Manager ID',
      admin: { condition: (_, sd) => Boolean(sd?.googleTagManagerEnabled) },
    },
  ],
})
