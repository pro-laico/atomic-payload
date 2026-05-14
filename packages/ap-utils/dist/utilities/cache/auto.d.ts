import 'server-only';
/** Per-request memoized `getCached` bound to the host project's `@payload-config`
 *  alias. Import this from any server component / server action to share one
 *  `react.cache` instance across every consumer in a render. */
declare const getCached: import("./getCached").GetCachedFn;
export default getCached;
//# sourceMappingURL=auto.d.ts.map