import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'

import type { GCFunction } from '../../types/cache'
import cacheLogger from '../cacheLogger'

/**
 * Returns the form submissions. Tag: form-submissions
 *
 * Runs with the Local API default (no user, access enforced). It exposes
 * whatever the host's `form-submissions` collection `read` access permits, so
 * that collection MUST restrict reads — this getter adds no gate of its own
 * beyond `server-only` (it must only be called from trusted server paths).
 */
export const getCachedFormSubmissions: GCFunction<'form-submissions'> = async (configPromise, tag, tid) => {
  const payload = await getPayload({ config: configPromise })
  const results = await payload
    .find({ collection: 'form-submissions', limit: 0, depth: 0, pagination: false, where: { 'form.title': { equals: tid } } })
    .then((res) => res.docs.map((doc) => doc))

  cacheLogger({ tag })
  return results
}
