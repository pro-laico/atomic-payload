import { revalidateCacheGlobal } from '@pro-laico/core'
import type { Access, GlobalConfig } from 'payload'

import { googleTagManagerTabField } from './gtmTab'
import { postHogTabField } from './postHogTab'

const authd: Access = ({ req }) => Boolean(req.user)

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
  hooks: { beforeChange: [revalidateCacheGlobal] },
  versions: { drafts: { schedulePublish: true, validate: true }, max: 10 },
}
