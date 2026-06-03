import 'server-only';
import type { GCFunction } from '../../types/cache';
/** Factory: pass the slug of the pages collection to bind the getter to it. */
export declare const createGetCachedAtomicClasses: (pagesSlug?: string) => GCFunction<"atomic-classes">;
/** Default getter bound to `pagesSlug = 'pages'`. */
export declare const getCachedAtomicClasses: GCFunction<'atomic-classes'>;
//# sourceMappingURL=getAtomicClasses.d.ts.map