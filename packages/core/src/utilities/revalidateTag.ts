'use server'
import 'server-only'

import { revalidateTag as rt } from 'next/cache'

import revalidationLogger from './log'
import { mt } from './mergeTags'
import type { AllTags, PromiseTagGroup, RArgs, RReturns } from '../types/cache'

/**
 * Next's `revalidateTag` requires a request/render context (its "static
 * generation store"). When content is written OUTSIDE one — e.g. while seeding
 * the database or from a CLI script — it throws
 * `Invariant: static generation store missing`. Revalidation is a best-effort
 * cache side effect there (nothing is cached yet), so swallow only that invariant
 * and let the surrounding write succeed; rethrow anything else.
 */
function safeRevalidate(tag: string, profile: 'max'): void {
  try {
    rt(tag, profile)
  } catch (err) {
    if (err instanceof Error && err.message.includes('static generation store missing')) return
    throw err
  }
}

/** Used by the admin ui site triggers component to revalidate all draft or published pages */
async function revalidateTag<T extends PromiseTagGroup>(...args: RArgs<T>): RReturns<T>
async function revalidateTag<T extends Exclude<AllTags, PromiseTagGroup>>(...args: RArgs<T>): RReturns<T>
async function revalidateTag(...args: RArgs<'all'>): RReturns<'all'> {
  const [tag, a, b] = args
  let tid = ''
  let draft = false

  if (typeof a === 'string') tid = a
  if (typeof a === 'boolean') draft = a
  if (typeof b === 'boolean') draft = b

  const tags: string[] = []
  let t: string = tag

  if (tid) t = mt([tag, tid])

  // Secondary revalidations and special handlings for specific tags.
  switch (tag) {
    case 'pages':
      await revalidateTag('sitemap', draft)
      break
    case 'designSet':
    case 'shortcutSet':
    case 'atomic-classes':
      await revalidateTag('site-css', draft)
      break
    case 'draft':
    case 'published':
      safeRevalidate(t, 'max')
      revalidationLogger([t])
      return { success: true, message: `Revalidated ${tag}`, timestamp: new Date().toISOString() }
    default:
      break
  }

  if (draft) {
    safeRevalidate(mt([t, 'draft']), 'max')
    tags.push(mt([t, 'draft']))
  } else {
    safeRevalidate(t, 'max')
    tags.push(t)
  }

  revalidationLogger(tags)
}

export { revalidateTag }
