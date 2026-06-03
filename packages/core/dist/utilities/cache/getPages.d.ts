import 'server-only';
import type { GCFunction } from '../../types/cache';
/** Factory: pass the slug of the pages collection to bind the pages-list getter to it. */
export declare const createGetCachedPages: (pagesSlug?: string) => GCFunction<"pages">;
export declare const getCachedPages: GCFunction<'pages'>;
//# sourceMappingURL=getPages.d.ts.map