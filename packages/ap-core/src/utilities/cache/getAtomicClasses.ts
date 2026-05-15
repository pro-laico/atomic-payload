'use server'
import 'server-only'
import { getPayload, Where } from 'payload'
import type { GCFunction } from '../../types/cache'
import cacheLogger from '../cacheLogger'

export const getCachedAtomicClasses: GCFunction<'atomic-classes'> = async (configPromise, tag, draft) => {
  const payload = await getPayload({ config: configPromise })

  const and: Where[] = [{ or: [{ storedAtomicClasses: { exists: true } }, { href: { equals: '/' } }] }]
  if (!draft) and.push({ live: { equals: true } })
  const where: Where = { and }

  const res = await payload.find({ collection: 'pages', draft, where, limit: 0, pagination: false, depth: 0, select: { storedAtomicClasses: true } })
  const docs = res.docs as Array<{ storedAtomicClasses?: string[] | null }>
  const result = docs.flatMap((doc) => doc.storedAtomicClasses ?? [])

  cacheLogger({ tag, draft })
  return result
}
