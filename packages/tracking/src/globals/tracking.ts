import type { GlobalConfig } from 'payload'
import { revalidateCacheGlobalAfterChange } from '@pro-laico/core'

import { postHogGroup } from './postHogGroup'
import { authd } from '../access/authenticated'
import { googleTagManagerGroup } from './gtmGroup'

export const Tracking: GlobalConfig = {
  slug: 'tracking',
  label: 'Settings',
  admin: { group: 'Tracking' },
  access: { read: authd, update: authd },
  fields: [
    // Provider on/off toggles live in the sidebar; each provider's settings
    // group (below) appears in the main area when its toggle is on.
    { name: 'googleTagManagerEnabled', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'postHogEnabled', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'vercelAnalyticsEnabled', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    googleTagManagerGroup(),
    postHogGroup(),
  ],
  hooks: { afterChange: [revalidateCacheGlobalAfterChange] },
  versions: { drafts: { schedulePublish: true, validate: true }, max: 10 },
}
