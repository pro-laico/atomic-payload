'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload, Where, type CollectionSlug } from 'payload'
import type { GCFunction } from '../../types/cache'
import cacheLogger from '../cacheLogger'

/** Factory: pass the slug of the pages collection to bind the pages-list getter to it. */
export const createGetCachedPages = (pagesSlug: string = 'pages'): GCFunction<'pages'> => {
  const collection = pagesSlug as CollectionSlug
  return async (configPromise, tag, draft) => {
    const payload = await getPayload({ config: configPromise })
    const where: Where = { href: { exists: true } }
    if (!draft) Object.assign(where, { live: { equals: true } })
    const result = await payload.find({
      collection,
      draft,
      where,
      limit: 0,
      overrideAccess: draft,
      select: { href: true } as Parameters<typeof payload.find>[0]['select'],
    })
    const docs = result.docs as Array<{ href?: string | null }>
    const returns = docs?.map(({ href }) => href).filter((href): href is string => href != null) || []
    cacheLogger({ tag, draft })
    return returns
  }
}

export const getCachedPages: GCFunction<'pages'> = createGetCachedPages()
