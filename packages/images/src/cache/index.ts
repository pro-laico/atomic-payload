import 'server-only'

import { cache } from 'react'
import { type CollectionSlug, getPayload } from 'payload'

import { getPayloadConfig } from '@pro-laico/core/config'
import { withCache } from '@pro-laico/core/cache/primitives'

type ImageDoc = { url?: string | null; sizes?: Record<string, { url?: string | null } | undefined | null> | null }

/** The URL of an image upload — the named `version` size if given, else the original. */
export const getCachedImage = cache((tid: string | null | undefined, version?: string | null): Promise<string | undefined> => {
  if (!tid) return Promise.resolve('')
  return withCache(
    async () => {
      const payload = await getPayload({ config: getPayloadConfig() })
      const image = (await payload.findByID({ collection: 'images' as CollectionSlug, id: tid, depth: 0 })) as ImageDoc | null
      if (!image) return undefined
      const url = version ? image.sizes?.[version]?.url || image.url : image.url
      return url || undefined
    },
    { tag: 'image', tid },
  )
})
