import type { GlobalConfig } from 'payload'
import { authd } from '@/access/authenticated'
import { postHogTabField } from './tabs/postHog'
import { googleTagManagerTabField } from './tabs/gtm'
import { revalidateCache } from '@/hooks/global/revalidate'

export const Tracking: GlobalConfig = {
  slug: 'tracking',
  label: 'Settings',
  admin: { group: 'Tracking' },
  access: { read: authd, update: authd },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'googleTagManagerEnabled', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
        { name: 'postHogEnabled', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
        { name: 'vercelAnalyticsEnabled', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
      ],
    },
    { type: 'tabs', tabs: [googleTagManagerTabField(), postHogTabField()] },
  ],
  hooks: { beforeChange: [revalidateCache] },
  versions: { drafts: { schedulePublish: true, validate: true }, max: 10 },
}
