import type { CollectionSlug, PayloadRequest } from 'payload'

import manualLogger from './utilities/manualLogger'

export type UnsetActiveType = (args: { id: string; draft: boolean; req: PayloadRequest; slug: CollectionSlug }) => Promise<CollectionSlug | undefined>

export const unsetActive: UnsetActiveType = async ({ id, draft, req, slug }) => {
  try {
    const results = await req.payload
      .update({
        req,
        draft,
        collection: slug,
        data: { active: false },
        where: { active: { equals: true }, id: { not_equals: id }, _status: { equals: draft ? 'draft' : 'published' } },
      })
      .then((res) => res?.docs.map((doc) => ('title' in doc ? doc?.title : doc?.id)))

    if (results && results.length > 0) manualLogger(`[UPDATE] Removed active status from: (${results?.join('), (')})`)
    else manualLogger(`[INFO] No active status to remove from ${slug} docs.`)
    return slug
  } catch (error) {
    // Rethrow rather than swallow: if this update fails, the current save would
    // still proceed and be marked active while the previously-active singleton
    // stays active — yielding two active docs. Throwing aborts the transaction
    // so the whole save rolls back atomically.
    req.payload.logger.error({ err: error, msg: `Failed to remove active status from ${slug} docs` })
    throw error
  }
}
