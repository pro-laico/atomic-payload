import 'server-only';
import type { PayloadConfigPromise } from '@pro-laico/atomic-payload-types';
/** Register the host project's Payload config (or its resolution promise) so
 *  package-side helpers like `cache/auto` can find it without relying on the
 *  conventional `@payload-config` import alias. Typically called from
 *  `apUtilsPlugin({ configPromise })` in `payload.config.ts`. */
export declare function registerConfigPromise(p: PayloadConfigPromise): void;
/** Resolve the configPromise — explicit registration wins; otherwise we fall
 *  back to dynamically importing `@payload-config`. The returned value may be
 *  a `Promise<Promise<SanitizedConfig>>`, but JS promise auto-flattening means
 *  consumers (e.g. `getPayload({ config })`) get the underlying config when
 *  they await it. */
export declare function getConfigPromise(): PayloadConfigPromise;
//# sourceMappingURL=configRegistry.d.ts.map