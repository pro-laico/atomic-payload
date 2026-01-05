'use server'
import 'server-only'
import { GCFunction } from '@/ts/types'
import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import cacheLogger from '@/utilities/log/cache'

export const getCachedAtomicClasses: GCFunction<'atomic-classes'> = async (tag, draft) => {
  const payload = await getPayload({ config: configPromise })

  const and: Where[] = [{ or: [{ storedAtomicClasses: { exists: true } }, { href: { equals: '/' } }] }]
  if (!draft) and.push({ live: { equals: true } })
  const where: Where = { and }

  const res = await payload.find({ collection: 'pages', draft, where, limit: 0, pagination: false, depth: 0, select: { storedAtomicClasses: true } })
  const result = res.docs.flatMap((doc) => doc.storedAtomicClasses ?? [])

  cacheLogger({ tag, draft })
  return result
}
