import type { GlobalConfig } from 'payload'
import { authd } from '@/access/authenticated'
import { revalidateCache } from '@/hooks/global/revalidate'

const d = {
  draft: 'Settings for the draft version of the website.',
  published: 'Settings for the published version of the website.',
  storeVersion:
    "The version of the websites persistent data. Changing this will reset the store, except for the cookie consent preferences. Use this when you change actions and things aren't working as expected.",
}

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Settings',
  admin: { group: 'Website' },
  access: { read: authd, update: authd },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'draft',
          admin: { description: d.draft },
          fields: [{ name: 'storeVersion', type: 'number', required: true, defaultValue: 0, admin: { description: d.storeVersion } }],
        },
        {
          name: 'published',
          admin: { description: d.published },
          fields: [{ name: 'storeVersion', type: 'number', required: true, defaultValue: 0, admin: { description: d.storeVersion } }],
        },
      ],
    },
  ],
  hooks: { beforeChange: [revalidateCache] },
  versions: { drafts: { schedulePublish: true, validate: true }, max: 10 },
}
