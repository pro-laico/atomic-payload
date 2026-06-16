import 'server-only'

import { cache } from 'react'
import { type CollectionSlug, getPayload } from 'payload'

import { getPayloadConfig } from '@pro-laico/core/config'
import { withCache } from '@pro-laico/core/cache/primitives'

type ImageDoc = {
  id?: string | number
  url?: string | null
  sizes?: Record<string, { url?: string | null } | undefined | null> | null
}

// Legacy size-name → on-demand transform preset, used when sizes aren't pre-generated.
const LEGACY_PRESETS: Record<string, string> = {
  thumbnail: 'w=300&fit=inside',
  square: 'w=500&h=500&fit=cover',
  small: 'w=600&fit=inside',
  medium: 'w=900&fit=inside',
  large: 'w=1400&fit=inside',
  xlarge: 'w=1920&fit=inside',
  og: 'w=1200&h=630&fit=cover',
}

/**
 * The URL of an image upload — the named `version` size if given, else the original.
 * Back-compat: when sizes aren't pre-generated (the default now), a legacy size name
 * maps to an on-demand transform URL instead of silently falling back to the full
 * original. Reads Payload once per id and caches by the `image` tag.
 */
export const getCachedImage = cache((tid: string | null | undefined, version?: string | null): Promise<string | undefined> => {
  if (!tid) return Promise.resolve('')
  return withCache(
    async () => {
      const payload = await getPayload({ config: getPayloadConfig() })
      const image = (await payload.findByID({ collection: 'images' as CollectionSlug, id: tid, depth: 0 })) as ImageDoc | null
      if (!image) return undefined
      if (version) {
        const stored = image.sizes?.[version]?.url
        if (stored) return stored
        const preset = LEGACY_PRESETS[version]
        if (preset) return `/api/img/${image.id ?? tid}?${preset}`
      }
      return image.url || undefined
    },
    { tag: 'image', tid },
  )
})
