import type { SanitizedConfig } from 'payload';
/** Values the host app must supply so cache getters can run without importing `@payload-config`. */
export type PayloadCacheBindings = {
    configPromise: Promise<SanitizedConfig>;
    /** Base site URL for absolute links (e.g. sitemap), typically without a trailing slash. */
    getServerSideURL: () => string;
};
//# sourceMappingURL=deps.d.ts.map