import 'server-only'; //DO NOT REMOVE
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
/** Gets the active shortcut set. */
export const getCachedShortcutSet = async (configPromise, tag, draft) => {
    const payload = await getPayload({ config: configPromise });
    const shortcutSet = await payload
        .find({ draft, collection: 'shortcutSet', pagination: false, limit: 1, where: { active: { equals: true } } })
        .then((result) => result.docs[0] || null);
    cacheLogger({ tag, draft });
    return shortcutSet;
};
//# sourceMappingURL=getShortcutSet.js.map