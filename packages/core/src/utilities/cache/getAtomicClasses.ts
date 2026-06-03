import 'server-only'
import { type CollectionSlug, getPayload, type Where } from 'payload'

import type { GCFunction } from '../../types/cache'
import cacheLogger from '../cacheLogger'

/** Factory: pass the slug of the pages collection to bind the getter to it. */
export const createGetCachedAtomicClasses = (pagesSlug: string = 'pages'): GCFunction<'atomic-classes'> => {
  const collection = pagesSlug as CollectionSlug
  return async (configPromise, tag, draft) => {
    const payload = await getPayload({ config: configPromise })

    const and: Where[] = [{ or: [{ storedAtomicClasses: { exists: true } }, { href: { equals: '/' } }] }]
    if (!draft) and.push({ live: { equals: true } })
    const where: Where = { and }

    const res = await payload.find({
      collection,
      draft,
      where,
      limit: 0,
      pagination: false,
      depth: 0,
      select: { storedAtomicClasses: true } as Parameters<typeof payload.find>[0]['select'],
    })
    const docs = res.docs as Array<{ storedAtomicClasses?: string[] | null }>
    const result = docs.flatMap((doc) => doc.storedAtomicClasses ?? [])

    cacheLogger({ tag, draft })
    return result
  }
}

/** Default getter bound to `pagesSlug = 'pages'`. */
export const getCachedAtomicClasses: GCFunction<'atomic-classes'> = createGetCachedAtomicClasses()
