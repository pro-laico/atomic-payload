import type { Tab } from 'payload'

export const TrackingTab: Tab = {
  label: 'Tracking',
  admin: { description: 'Used to add tracking properties to the block.' },
  fields: [
    {
      name: 'contentPostHogProperty',
      type: 'relationship',
      relationTo: 'posthogProperty',
      hasMany: true,
      admin: {
        condition: (_, sd) =>
          Boolean(sd?.blockType === 'AtomicChild') ? Boolean(sd.type !== 'button') || Boolean(sd.buttonType === 'portal') : true,
      },
    },
    {
      name: 'triggerPostHogProperty',
      type: 'relationship',
      relationTo: 'posthogProperty',
      hasMany: true,
      admin: { condition: (_, sd) => (Boolean(sd?.blockType === 'AtomicChild') ? Boolean(sd.type === 'button') : false) },
    },
  ],
}
