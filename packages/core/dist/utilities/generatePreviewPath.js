import { getClientSideURL } from './getURL';
/** Generates the URL Payload's admin "live preview" iframe should hit. Handles
 *  pages-with-href (uses the latest breadcrumb), pages-with-testPath (looks up
 *  the target page), and falls back to `/testing`. The host project must
 *  provide a `/next/preview` route handler (see
 *  `@pro-laico/core/next/preview`). */
export const generateLivePreviewPath = async ({ data, req: { payload } }, options = {}) => {
    const pagesSlug = (options.pagesSlug ?? 'pages');
    try {
        let slug = typeof data?.title === 'string' ? data.title : 'testing';
        let path = '/testing';
        const href = data?.breadcrumbs && data?.breadcrumbs?.length > 0 ? data?.breadcrumbs[data?.breadcrumbs?.length - 1]?.url : undefined;
        if (typeof data?.testPath === 'string') {
            try {
                const page = (await payload.findByID({
                    collection: pagesSlug,
                    id: data?.testPath,
                    select: { href: true },
                }));
                if (page?.href)
                    path = page.href;
            }
            catch (_error) {
                payload.logger.info('No Page Found. Loading /testing instead.');
            }
        }
        if (typeof href === 'string') {
            path = href;
            if (typeof data?.slug === 'string')
                slug = data.slug || 'home';
        }
        const encodedParams = new URLSearchParams({ slug, path, collection: pagesSlug, previewSecret: process.env.PREVIEW_SECRET || '' });
        const url = `/next/preview?${encodedParams.toString()}`;
        return getClientSideURL() + url;
    }
    catch (_error) {
        payload.logger.error('Error generating live preview path');
        return '/testing';
    }
};
//# sourceMappingURL=generatePreviewPath.js.map