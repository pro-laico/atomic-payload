import 'server-only';
import type { GCFunction } from '../../types/cache';
/**
 * Returns the form submissions. Tag: form-submissions
 *
 * Runs with the Local API default (no user, access enforced). It exposes
 * whatever the host's `form-submissions` collection `read` access permits, so
 * that collection MUST restrict reads — this getter adds no gate of its own
 * beyond `server-only` (it must only be called from trusted server paths).
 */
export declare const getCachedFormSubmissions: GCFunction<'form-submissions'>;
//# sourceMappingURL=getFormSubmissions.d.ts.map