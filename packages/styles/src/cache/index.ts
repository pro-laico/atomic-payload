import 'server-only'

import { cache } from 'react'
import { type CollectionSlug, getPayload, type GlobalSlug, type Where } from 'payload'

import { getPayloadConfig } from '@pro-laico/core/config'
import { withCache } from '@pro-laico/core/cache/primitives'

import type { CssProcessorGetCached } from '../cssProcessor'
import type { DesignSet, ShortcutSet } from '../types/payload-augment'

/** The active design set. */
export const getCachedDesignSet = cache(
  (draft: boolean): Promise<DesignSet | undefined> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        return payload
          .find({ collection: 'designSet' as CollectionSlug, draft, where: { active: { equals: true } }, limit: 1 })
          .then((res) => (res.docs[0] || undefined) as unknown as DesignSet | undefined)
      },
      { tag: 'designSet', draft },
    ),
)

/** The active shortcut set. */
export const getCachedShortcutSet = cache(
  (draft: boolean): Promise<ShortcutSet | undefined> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        return payload
          .find({ draft, collection: 'shortcutSet' as CollectionSlug, pagination: false, limit: 1, where: { active: { equals: true } } })
          .then((res) => (res.docs[0] || undefined) as unknown as ShortcutSet | undefined)
      },
      { tag: 'shortcutSet', draft },
    ),
)

/** The generated stylesheet from the draft / published CSS storage global. */
export const getCachedSiteCSS = cache(
  (draft: boolean): Promise<string> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        const css = await payload
          .findGlobal({
            draft,
            slug: `${draft ? 'draft' : 'published'}Storage` as GlobalSlug,
            select: { layoutCSS: true } as Parameters<typeof payload.findGlobal>[0]['select'],
          })
          .then((res) => (res as { layoutCSS?: string | null }).layoutCSS)
        return css || ''
      },
      { tag: 'site-css', draft },
    ),
)

/** Factory: bind the atomic-classes getter to a pages collection slug. */
export const createGetCachedAtomicClasses =
  (pagesSlug: string = 'pages') =>
  (draft: boolean): Promise<string[]> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        const and: Where[] = [{ or: [{ storedAtomicClasses: { exists: true } }, { href: { equals: '/' } }] }]
        if (!draft) and.push({ live: { equals: true } })
        const res = await payload.find({
          collection: pagesSlug as CollectionSlug,
          draft,
          where: { and },
          limit: 0,
          pagination: false,
          depth: 0,
          select: { storedAtomicClasses: true } as Parameters<typeof payload.find>[0]['select'],
        })
        const docs = res.docs as Array<{ storedAtomicClasses?: string[] | null }>
        return docs.flatMap((doc) => doc.storedAtomicClasses ?? [])
      },
      { tag: 'atomic-classes', draft },
    )

/** Every stored atomic class across page-like docs (drives the generated CSS safelist). */
export const getCachedAtomicClasses = cache(createGetCachedAtomicClasses())

/** Optional cross-package getters the CSS processor pulls in (header / footer are
 *  owned by `@pro-laico/site`, injected so a header-less app needs neither). */
export type CssGetCachedDeps = {
  getHeader?: (draft: boolean) => Promise<unknown>
  getFooter?: (draft: boolean) => Promise<unknown>
  /** Slug → cached-tag key the processor calls with (defaults to header/footer/designSet/shortcutSet). */
  cssCacheTagBySlug?: Record<string, string>
}

/**
 * Build the narrow `(tag, draft)` getter the CSS processor calls. Resolves this
 * package's own `designSet` / `shortcutSet` / `atomic-classes` directly and
 * delegates `header` / `footer` to the injected getters (or returns `undefined`
 * when the app has none). This replaces injecting a monolithic `getCached`.
 */
export function createCssGetCached(deps: CssGetCachedDeps = {}): CssProcessorGetCached {
  const tags = { header: 'header', footer: 'footer', designSet: 'designSet', shortcutSet: 'shortcutSet', ...deps.cssCacheTagBySlug }
  return (tag, draft) => {
    if (tag === 'atomic-classes') return getCachedAtomicClasses(draft)
    if (tag === tags.designSet) return getCachedDesignSet(draft)
    if (tag === tags.shortcutSet) return getCachedShortcutSet(draft)
    if (tag === tags.header) return deps.getHeader?.(draft) ?? Promise.resolve(undefined)
    if (tag === tags.footer) return deps.getFooter?.(draft) ?? Promise.resolve(undefined)
    return Promise.resolve(undefined)
  }
}
