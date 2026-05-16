/**
 * Additively merge two Payload hooks objects: each per-phase array in `extra`
 * is appended to the corresponding array in `base`. Phases present in only one
 * of the two objects are preserved as-is.
 *
 * Generic over the hooks shape, so it works for collection, global, and field
 * hooks alike. Call with the hooks type as the explicit type argument when
 * inference can't reconcile a narrow literal `base` with a wider `extra`:
 *
 * ```ts
 * type Hooks = NonNullable<CollectionConfig['hooks']>
 * hooks: mergeHooks<Hooks>(
 *   { beforeChange: [a, b], afterDelete: [c] },
 *   extraHooks,
 * )
 * ```
 *
 * User hooks always run AFTER base hooks within each phase (base first, then
 * extra). When `extra` is undefined, `base` is returned unchanged.
 */
export declare const mergeHooks: <T>(base: T, extra?: T) => T;
//# sourceMappingURL=mergeHooks.d.ts.map