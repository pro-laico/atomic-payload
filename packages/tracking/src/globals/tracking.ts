import type { GlobalConfig } from 'payload'
import { revalidateCacheGlobalAfterChange } from '@pro-laico/core'

import { postHogTabField } from './postHogTab'
import { authd } from '../access/authenticated'
import { googleTagManagerTabField } from './gtmTab'

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
  hooks: { afterChange: [revalidateCacheGlobalAfterChange] },
  versions: { drafts: { schedulePublish: true, validate: true }, max: 10 },
}
