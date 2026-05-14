'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'
import type { GCFunction } from '@pro-laico/atomic-payload-types'
import cacheLogger from '../cacheLogger'

/** Gets the active shortcut set. */
export const getCachedShortcutSet: GCFunction<'shortcutSet'> = async (configPromise, tag, draft) => {
  const payload = await getPayload({ config: configPromise })
  const shortcutSet = await payload
    .find({ draft, collection: 'shortcutSet', pagination: false, limit: 1, where: { active: { equals: true } } })
    .then((result) => result.docs[0] || null)

  cacheLogger({ tag, draft })
  return shortcutSet
}
