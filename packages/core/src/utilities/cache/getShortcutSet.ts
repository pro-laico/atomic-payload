import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'

import cacheLogger from '../cacheLogger'
import type { GCFunction } from '../../types/cache'

/** Gets the active shortcut set. */
export const getCachedShortcutSet: GCFunction<'shortcutSet'> = async (configPromise, tag, draft) => {
  const payload = await getPayload({ config: configPromise })
  const shortcutSet = await payload
    .find({ draft, collection: 'shortcutSet', pagination: false, limit: 1, where: { active: { equals: true } } })
    .then((result) => result.docs[0] || null)

  cacheLogger({ tag, draft })
  return shortcutSet
}
