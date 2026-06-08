import 'server-only'

import { cache } from 'react'
import { type CollectionSlug, getPayload, type GlobalSlug, type Where } from 'payload'

import { getServerSideURL, manualLogger, sanitizeData } from '@pro-laico/core'
import { getPayloadConfig } from '@pro-laico/core/config'
import { withCache } from '@pro-laico/core/cache/primitives'

import type { Footer, Header, Page, SiteMetaDatum } from '../types/payload-augment'

/** Data returned by the page getter — the slice a frontend route renders. */
export type PageReturn = Pick<Page, 'children' | 'mainClassName' | 'meta' | 'id'>

/** A single sitemap entry. */
export type SiteMapEntry = {
  url: string
  priority: number
  lastModified: string
  changeFrequency: 'yearly' | 'monthly' | 'weekly' | 'daily' | 'hourly' | 'never'
}

/** The active header. */
export const getCachedHeader = cache(
  (draft: boolean): Promise<Header> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        return payload
          .find({ collection: 'header' as CollectionSlug, draft, limit: 1, pagination: false, where: { active: { equals: true } } })
          .then((res) => res.docs[0] as unknown as Header)
      },
      { tag: 'header', draft },
    ),
)

/** The active footer. */
export const getCachedFooter = cache(
  (draft: boolean): Promise<Footer> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        return payload
          .find({ collection: 'footer' as CollectionSlug, draft, limit: 1, pagination: false, where: { active: { equals: true } } })
          .then((res) => res.docs[0] as unknown as Footer)
      },
      { tag: 'footer', draft },
    ),
)

/** Factory: bind the pages-list getter to a pages collection slug. */
export const createGetCachedPages =
  (pagesSlug: string = 'pages') =>
  (draft: boolean): Promise<string[]> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        const where: Where = { href: { exists: true } }
        if (!draft) Object.assign(where, { live: { equals: true } })
        const result = await payload.find({
          collection: pagesSlug as CollectionSlug,
          draft,
          where,
          limit: 0,
          overrideAccess: draft,
          select: { href: true } as Parameters<typeof payload.find>[0]['select'],
        })
        const docs = result.docs as Array<{ href?: string | null }>
        return docs?.map(({ href }) => href).filter((href): href is string => href != null) || []
      },
      { tag: 'pages', draft },
    )

/** Every page href (live pages for published, all for draft). */
export const getCachedPages = cache(createGetCachedPages())

/** Factory: bind the page-by-href getter to a pages collection slug. */
export const createGetCachedPageByHref =
  (pagesSlug: string = 'pages') =>
  (href: string, draft: boolean, pages: string[]): Promise<PageReturn | undefined> =>
    withCache(
      async () => {
        if (!pages.includes(href)) {
          manualLogger(`[Warning] - Page not found - ${href}`)
          return undefined
        }
        const payload = await getPayload({ config: getPayloadConfig() })
        const where: Where = { href: { equals: href } }
        if (!draft) Object.assign(where, { live: { equals: true } })
        return payload
          .find({
            collection: pagesSlug as CollectionSlug,
            draft,
            where,
            limit: 1,
            depth: 1000,
            pagination: false,
            overrideAccess: draft,
            select: { meta: true, children: true, mainClassName: true } as Parameters<typeof payload.find>[0]['select'],
          })
          .then((res) => res.docs?.[0] || null)
          .then((res) => sanitizeData(res) as unknown as PageReturn | undefined)
      },
      { tag: 'page', tid: href, draft },
    )

/** A single page resolved by its `href`. */
export const getCachedPageByHref = cache(createGetCachedPageByHref())

/** Factory: bind the sitemap getter to a pages collection slug. */
export const createGetCachedSitemap =
  (pagesSlug: string = 'pages') =>
  (draft: boolean): Promise<SiteMapEntry[]> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        const where: Where = { href: { exists: true } }
        if (!draft) Object.assign(where, { live: { equals: true }, 'meta.noIndex': { equals: false } })
        const results = await payload.find({
          collection: pagesSlug as CollectionSlug,
          draft,
          where,
          depth: 0,
          limit: 0,
          overrideAccess: draft,
          select: { href: true, updatedAt: true, meta: { priority: true, noIndex: true, changeFrequency: true } } as Parameters<
            typeof payload.find
          >[0]['select'],
        })

        type SitemapDoc = {
          href?: string | null
          updatedAt?: string | null
          meta?: { priority?: number | null; noIndex?: boolean | null; changeFrequency?: SiteMapEntry['changeFrequency'] | null } | null
        }
        const pages = ((results.docs as SitemapDoc[]) || []).filter(({ href }) => href !== '/404')
        const base = getServerSideURL()
        const dateFallback = new Date().toISOString()
        return pages.map(({ href, updatedAt, meta }) => ({
          priority: href === '/' ? 1 : meta?.priority || 0.5,
          url: href === '/' ? `${base}` : `${base}${href}`,
          lastModified: updatedAt || dateFallback,
          changeFrequency: meta?.changeFrequency || 'monthly',
        }))
      },
      { tag: 'sitemap', draft },
    )

/** The sitemap entries for every indexable page. */
export const getCachedSitemap = cache(createGetCachedSitemap())

/** All site metadata from the `siteMetaData` global. */
export const getCachedSiteMetadata = cache(
  (draft: boolean): Promise<SiteMetaDatum | undefined> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        return (await payload.findGlobal({ slug: 'siteMetaData' as GlobalSlug, draft })) as SiteMetaDatum | undefined
      },
      { tag: 'site-metadata', draft },
    ),
)
