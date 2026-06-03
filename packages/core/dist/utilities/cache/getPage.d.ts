import 'server-only';
import type { GCFunction } from '../../types/cache';
/** Factory: pass the slug of the pages collection to bind the page-by-href getter to it. */
export declare const createGetCachedPageByHref: (pagesSlug?: string) => GCFunction<"page">;
export declare const getCachedPageByHref: GCFunction<'page'>;
//# sourceMappingURL=getPage.d.ts.map