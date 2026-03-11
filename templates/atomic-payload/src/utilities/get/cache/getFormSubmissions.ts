'use server'
import 'server-only' //DO NOT REMOVE
import { getPayload } from 'payload'
import { GCFunction } from '@/ts/types'
import configPromise from '@payload-config'
import cacheLogger from '@/utilities/log/cache'

/** Returns the form submissions. Tag: form-submissions */
export const getCachedFormSubmissions: GCFunction<'form-submissions'> = async (tag, tid) => {
  const payload = await getPayload({ config: configPromise })
  const results = await payload
    .find({ collection: 'form-submissions', limit: 0, depth: 0, pagination: false, where: { 'form.title': { equals: tid } } })
    .then((res) => res.docs.map((doc) => doc))

  cacheLogger({ tag })
  return results
}
