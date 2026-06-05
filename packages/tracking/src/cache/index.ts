import 'server-only'

import { cache } from 'react'
import { getPayload, type GlobalSlug } from 'payload'

import { getPayloadConfig } from '@pro-laico/core/config'
import { withCache } from '@pro-laico/core/cache/primitives'

import type { Tracking } from '../types/payload-augment'

/** Tracking settings (PostHog / Vercel Analytics / Google Tag Manager) from the `tracking` global. */
export const getCachedTracking = cache(
  (draft: boolean): Promise<Tracking | undefined> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        return (await payload.findGlobal({ slug: 'tracking' as GlobalSlug, draft })) as Tracking | undefined
      },
      { tag: 'tracking', draft },
    ),
)
