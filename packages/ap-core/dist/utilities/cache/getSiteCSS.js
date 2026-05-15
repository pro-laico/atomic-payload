'use server';
import 'server-only'; //DO NOT REMOVE
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
// Gets the site css stored in payload, under the global 'draftStorage' or 'publishedStorage'.
export const getCachedSiteCSS = async (configPromise, tag, draft) => {
    const payload = await getPayload({ config: configPromise });
    const results = await payload
        .findGlobal({ draft, slug: `${draft ? 'draft' : 'published'}Storage`, select: { layoutCSS: true } })
        .then((res) => res.layoutCSS);
    cacheLogger({ tag, draft });
    return results || '';
};
//# sourceMappingURL=getSiteCSS.js.map