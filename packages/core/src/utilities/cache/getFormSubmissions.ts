'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'

import type { GCFunction } from '../../types/cache'
import cacheLogger from '../cacheLogger'

/** Returns the form submissions. Tag: form-submissions */
export const getCachedFormSubmissions: GCFunction<'form-submissions'> = async (configPromise, tag, tid) => {
  const payload = await getPayload({ config: configPromise })
  const results = await payload
    .find({ collection: 'form-submissions', limit: 0, depth: 0, pagination: false, where: { 'form.title': { equals: tid } } })
    .then((res) => res.docs.map((doc) => doc))

  cacheLogger({ tag })
  return results
}
