import 'server-only';
import type { GCFunction } from '../../types/cache';
/** Factory: pass the slug of the backend forms collection. */
export declare const createGetCachedBackendForms: (formsSlug?: string) => GCFunction<"backend-forms">;
/** Factory: pass the slug of the pages collection to scan for atomic forms. */
export declare const createGetCachedAtomicForms: (pagesSlug?: string) => GCFunction<"atomic-forms">;
export declare const getCachedBackendForms: GCFunction<'backend-forms'>;
export declare const getCachedAtomicForms: GCFunction<'atomic-forms'>;
/** Used in Atomic Blocks Dynamic Form Submission Only */
export declare const getCachedAllForms: GCFunction<'all-forms'>;
//# sourceMappingURL=getForms.d.ts.map