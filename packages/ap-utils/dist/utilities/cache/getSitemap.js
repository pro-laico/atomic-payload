'use server';
import 'server-only'; //DO NOT REMOVE
import { getPayload } from 'payload';
import cacheLogger from '../cacheLogger';
import { getServerSideURL } from '../getServerSideURL';
/** Gets the pages stored in payload and formats them into a sitemap array. */
export const getCachedSitemap = async (configPromise, tag, draft) => {
    const payload = await getPayload({ config: configPromise });
    const where = { href: { exists: true } };
    if (!draft)
        Object.assign(where, { live: { equals: true }, 'meta.noIndex': { equals: false } });
    const results = await payload.find({
        collection: 'pages',
        draft,
        where,
        depth: 0,
        limit: 0,
        overrideAccess: draft,
        select: { href: true, updatedAt: true, meta: { priority: true, noIndex: true, changeFrequency: true } },
    });
    const pages = results.docs || [];
    const pagesWithout404 = pages.filter(({ href }) => href !== '/404'); // Exclude 404 page
    const dateFallback = new Date().toISOString();
    const sitemap = pagesWithout404
        ? pagesWithout404.map((page) => {
            const { href, updatedAt, meta } = page;
            if (href === '/') {
                return {
                    priority: 1,
                    url: `${getServerSideURL()}`,
                    lastModified: updatedAt || dateFallback,
                    changeFrequency: meta?.changeFrequency || 'monthly',
                };
            }
            return {
                priority: meta?.priority || 0.5,
                url: `${getServerSideURL()}${href}`,
                lastModified: updatedAt || dateFallback,
                changeFrequency: meta?.changeFrequency || 'monthly',
            };
        })
        : [];
    cacheLogger({ tag, draft });
    return sitemap;
};
//# sourceMappingURL=getSitemap.js.map