import 'server-only';
import type { PayloadConfigPromise } from '@pro-laico/ap-utils';
/** Builds a per-request memoized `getCached` (via `react.cache`) bound to the
 *  host project's Payload `configPromise`. Use this in server components when
 *  the same tag may be requested multiple times within a single render. */
export declare function createReactCachedGetCached(configPromise: PayloadConfigPromise): import("./getCached").GetCachedFn;
//# sourceMappingURL=react.d.ts.map