'use server'
import 'server-only' //DO NOT REMOVE
import { manualLogger, sanitizeData } from '@pro-laico/atomic/hook/light'
import { type CollectionSlug, getPayload, type Where } from 'payload'

import type { GCFunction } from '../../types/cache'
import cacheLogger from '../cacheLogger'

type PageGCReturn = Awaited<ReturnType<GCFunction<'page'>>>

/** Factory: pass the slug of the pages collection to bind the page-by-href getter to it. */
export const createGetCachedPageByHref = (pagesSlug: string = 'pages'): GCFunction<'page'> => {
  const collection = pagesSlug as CollectionSlug
  return async (configPromise, tag, tid, draft, pages) => {
    if (!pages.includes(tid)) {
      manualLogger(`[Warning] - Page not found - ${tid}`)
      return
    }
    const payload = await getPayload({ config: configPromise })
    const where: Where = { href: { equals: tid } }
    if (!draft) Object.assign(where, { live: { equals: true } })
    const results = await payload
      .find({
        collection,
        draft,
        where,
        limit: 1,
        depth: 1000,
        pagination: false,
        overrideAccess: draft,
        select: { meta: true, children: true, mainClassName: true } as Parameters<typeof payload.find>[0]['select'],
      })
      .then((res) => res.docs?.[0] || null)
      .then((res) => sanitizeData(res))

    cacheLogger({ tag, tid, draft })
    return results as PageGCReturn
  }
}

export const getCachedPageByHref: GCFunction<'page'> = createGetCachedPageByHref()
