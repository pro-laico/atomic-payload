import 'server-only';
import type { GCFunction } from '../../types/cache';
/** Gets all backend forms stored in the forms collection. */
export declare const getCachedBackendForms: GCFunction<'backend-forms'>;
/** Gets all atomic forms stored in the pages collection. */
export declare const getCachedAtomicForms: GCFunction<'atomic-forms'>;
/** Used in Atomic Blocks Dynamic Form Submission Only */
export declare const getCachedAllForms: GCFunction<'all-forms'>;
//# sourceMappingURL=getForms.d.ts.map