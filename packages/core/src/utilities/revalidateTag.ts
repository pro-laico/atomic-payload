'use server'
import 'server-only'
import { revalidateTag as rt } from 'next/cache'

import type { AllTags, PromiseTagGroup, RArgs, RReturns } from '../types/cache'
import revalidationLogger from './log'
import { mt } from './mergeTags'

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
      rt(t, 'max')
      revalidationLogger([t])
      return { success: true, message: `Revalidated ${tag}`, timestamp: new Date().toISOString() }
    default:
      break
  }

  if (draft) {
    rt(mt([t, 'draft']), 'max')
    tags.push(mt([t, 'draft']))
  } else {
    rt(t, 'max')
    tags.push(t)
  }

  revalidationLogger(tags)
}

export { revalidateTag }
