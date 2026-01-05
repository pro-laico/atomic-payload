import { PayloadRequest, CollectionSlug } from 'payload'
import manualLogger from '@/utilities/log/manual'

export type UnsetActiveType = (args: { id: string; draft: boolean; req: PayloadRequest; slug: CollectionSlug }) => Promise<string | undefined>

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
    manualLogger(`[ERROR] Error removing active status from ${slug} docs. ${error}`)
  }
}
