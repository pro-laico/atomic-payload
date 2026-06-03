import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'

import type { GCFunction } from '../../types/cache'
import cacheLogger from '../cacheLogger'

export const getCachedImage: GCFunction<'image'> = async (configPromise, tag, tid, version) => {
  if (!tid) return ''

  const payload = await getPayload({ config: configPromise })
  const image = await payload.findByID({ collection: 'images', id: tid })
  if (!image) return

  const url = version ? image.sizes?.[version]?.url || image.url : image.url
  if (!url) return

  cacheLogger({ tag, tid })
  return url
}
