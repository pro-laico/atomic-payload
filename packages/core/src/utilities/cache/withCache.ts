import 'server-only'

import { unstable_cache } from 'next/cache'

import { mt } from '../mergeTags'

export { mt } from '../mergeTags'

/** Inputs for deriving an `unstable_cache` key + revalidation-tag set. */
export type WithCacheOptions = {
  /** Primary cache tag, e.g. `'designSet'` or `'image'`. */
  tag: string
  /** Optional id appended to the key/tags (id-bound getters like image / page / icon). */
  tid?: string
  /** Whether this is the draft variant. */
  draft?: boolean
  /** Extra dependency tags beyond the standard set (e.g. an `icon` entry also depends on `iconSet`). */
  extraTags?: (string | undefined)[]
}

/**
 * Wrap a fetcher in Next's `unstable_cache`, deriving the cache-key parts and the
 * revalidation-tag set from `(tag, tid, draft)` exactly the way the former
 * monolithic `getCached` dispatcher did. Each package's getter calls this so the
 * cache-key / tag scheme stays consistent across the workspace while the data
 * fetch itself lives in the package that owns the collection.
 *
 * Caching primitive only — no data knowledge — so it stays in `@pro-laico/core`.
 */
export function withCache<T>(fetcher: () => Promise<T>, { tag, tid, draft, extraTags = [] }: WithCacheOptions): Promise<T> {
  const draftTag: 'draft' | undefined = draft ? 'draft' : undefined

  if (process?.env?.LOGS === 'true') console.log('\x1b[32m%s\x1b[0m', `[GET] - ${mt([tag, tid, draftTag])}`)

  const keyParts: string[] = [tag]
  if (tid) keyParts.push(tid)
  if (draft) keyParts.push('draft')

  const tags: string[] = [tag]
  if (tid) tags.push(tid)
  if (draft) tags.push(mt([tag, draftTag]))
  tags.push(draft ? 'draft' : 'published')
  if (tid) tags.push(mt([tag, tid, draftTag]))
  for (const extra of extraTags) if (extra) tags.push(extra)

  return unstable_cache(fetcher, keyParts, { tags })()
}
