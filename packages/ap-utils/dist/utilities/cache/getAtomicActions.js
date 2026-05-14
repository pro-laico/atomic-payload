'use server';
import 'server-only'; //DO NOT REMOVE
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
/** Gets all atomic actions stored in the pages collection. */
export const getCachedAtomicActions = async (configPromise, tag, draft) => {
    const payload = await getPayload({ config: configPromise });
    const where = { storedAtomicActions: { exists: true } };
    if (!draft)
        Object.assign(where, { live: { equals: true } });
    const draftPublished = draft ? 'draft' : 'published';
    const settings = await payload.findGlobal({ slug: 'settings' });
    const version = settings?.[draftPublished]?.storeVersion || 0;
    /*   const actions = await payload
      .find({
        draft,
        where,
        limit: 0,
        depth: 1,
        pagination: false,
        collection: 'pages',
        select: { storedAtomicActions: true },
      })
      .then((res) => {
        const allActions: StoredAtomicActions = {}
  
        res.docs
          ?.map(({ storedAtomicActions }) => storedAtomicActions)
          .filter((action): action is StoredAtomicActions => Boolean(action && Object.keys(action).length > 0))
          .forEach((actions) => {
            Object.assign(allActions, actions)
          })
  
        return allActions
      }) */
    const result = {
        version,
        //storedAtomicActions: actions,
    };
    cacheLogger({ tag, draft });
    return result;
};
//# sourceMappingURL=getAtomicActions.js.map