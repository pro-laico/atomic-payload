import 'server-only';
import type { GCFunction } from '../../types/cache';
/** Factory: pass the slug of the pages collection to bind the sitemap getter to it. */
export declare const createGetCachedSitemap: (pagesSlug?: string) => GCFunction<"sitemap">;
export declare const getCachedSitemap: GCFunction<'sitemap'>;
//# sourceMappingURL=getSitemap.d.ts.map