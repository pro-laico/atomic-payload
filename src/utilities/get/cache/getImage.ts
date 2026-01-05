'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'
import { GCFunction } from '@/ts/types'
import configPromise from '@payload-config'
import cacheLogger from '@/utilities/log/cache'

export const getCachedImage: GCFunction<'image'> = async (tag, tid, version) => {
  if (!tid) return ''

  const payload = await getPayload({ config: configPromise })
  const image = await payload.findByID({ collection: 'images', id: tid })
  if (!image) return

  const url = version ? image.sizes?.[version]?.url || image.url : image.url
  if (!url) return

  cacheLogger({ tag, tid })
  return url
}
