'use server'
import 'server-only'
import { mt } from './mergeTags'
import { revalidateTag as rt } from 'next/cache'
import revalidationLogger from '@/utilities/log/revalidation'
import { AllTags, PromiseTagGroup, RArgs, RReturns } from '@/ts/types'

/** Used by the admin ui site triggers component to revalidate all draft or published pages */
async function revalidateTag<T extends PromiseTagGroup>(args: RArgs<T>): RReturns<T>
async function revalidateTag<T extends Exclude<AllTags, PromiseTagGroup>>(args: RArgs<T>): RReturns<T>
async function revalidateTag(args: RArgs<'all'>): RReturns<'all'> {
  const { tag } = args
  const tags: string[] = []
  let t: string = tag

  const draft = 'draft' in args ? args.draft : false
  if ('tid' in args) t = mt([tag, args.tid])

  // Secondary revalidations and special handlings for specific tags.
  switch (tag) {
    case 'pages':
      revalidateTag({ tag: 'sitemap', draft })
      break
    case 'designSet':
    case 'shortcutSet':
    case 'atomic-classes':
      revalidateTag({ tag: 'site-css', draft })
      break
    case 'draft':
    case 'published':
      rt(t)
      revalidationLogger([t])
      return { success: true, message: `Revalidated ${tag}`, timestamp: new Date().toISOString() }
    default:
      break
  }

  if (draft) {
    rt(mt([t, 'draft']))
    tags.push(mt([t, 'draft']))
  } else {
    rt(t)
    tags.push(t)
  }

  revalidationLogger(tags)
}

export { revalidateTag }
