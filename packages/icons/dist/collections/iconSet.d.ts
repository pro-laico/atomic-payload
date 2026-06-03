import type { CollectionConfig, Field, PayloadRequest } from 'payload';
/**
 * Options for {@link createIconSetCollection} — the `IconSet` collection that
 * groups Icons under a named bucket with versions, drafts, APF `active`
 * support, and optional live preview wiring.
 *
 * Built-in revalidation hooks come from `@pro-laico/core`
 * (`revalidateCacheCollectionAfterChange` on `afterChange`, `revalidateCacheOnDelete`
 * on `afterDelete`); the icons package has no runtime dependency on
 * `@pro-laico/atomic`. If you need the atomicHook snapshot behavior, attach
 * it yourself via {@link hooks}.
 *
 * Field-injection options land at different locations in the admin UI; pick
 * the one that matches the field's natural shape:
 *
 * - {@link extraSettingsFields} — compact, packed into the title/active row.
 * - {@link fields} — full-width, below the title/active row in Settings.
 * - {@link iconRowFields} — per-icon, inside each `iconsArray` entry.
 *
 * @example
 * ```ts
 * createIconSetCollection({
 *   livePreviewUrl,
 *   fields: [{ name: 'description', type: 'textarea' }],
 *   iconRowFields: [{ name: 'aliases', type: 'text', hasMany: true }],
 * })
 * ```
 */
export interface IconSetCollectionOptions {
    /**
     * Live preview URL generator. When supplied, wires both `admin.preview`
     * (legacy iframe preview) and `admin.livePreview.url` (Payload 3 live
     * preview). Typically delegates to your project's `generateLivePreviewPath`
     * helper.
     *
     * @example
     * ```ts
     * livePreviewUrl: ({ data, req }) => generateLivePreviewPath({ data, req })
     * ```
     */
    livePreviewUrl?: (args: {
        data: Record<string, unknown>;
        req: PayloadRequest;
    }) => string | Promise<string>;
    /**
     * Extra fields packed INTO the Settings tab row alongside `title` and
     * `active`. Compact horizontal layout — appropriate for narrow,
     * width-constrained fields (booleans, short selects, slug-style text).
     *
     * For full-width set-level metadata (textareas, relationships, arrays),
     * prefer {@link fields}.
     *
     * @example
     * ```ts
     * extraSettingsFields: [TestPathField]
     * ```
     */
    extraSettingsFields?: Field[];
    /**
     * Override the `admin.useAsTitle` setting.
     *
     * @default 'title'
     */
    useAsTitle?: string;
    /**
     * Override the `admin.group` label shown in the Payload sidebar.
     *
     * @default 'Sets'
     */
    group?: string;
    /**
     * Additional Payload hooks merged ADDITIVELY into the built-ins — user
     * hooks run AFTER the defaults within their phase:
     *
     * - `afterChange`: `[revalidateCacheCollectionAfterChange, ...yours]`
     * - `afterDelete`: `[revalidateCacheOnDelete, ...yours]`
     * - Any other phase (`afterChange`, `beforeRead`, `afterRead`, …): just
     *   your hooks, no built-ins.
     *
     * This is also the opt-in point for `@pro-laico/atomic`'s `atomicHook` —
     * attach it via `hooks.beforeChange` if you want this collection in the
     * atomic-data snapshot.
     *
     * @example
     * ```ts
     * import { atomicHook } from '@pro-laico/atomic/hook'
     * createIconSetCollection({ hooks: { beforeChange: [atomicHook] } })
     * ```
     */
    hooks?: CollectionConfig['hooks'];
    /**
     * Extra set-level fields appended to the Settings tab, BELOW the
     * title/active row. Each field renders full-width — use for descriptions,
     * relationships, arrays, and anything that needs more horizontal space than
     * the title/active row offers.
     *
     * For compact in-row injection alongside title/active, use
     * {@link extraSettingsFields}.
     *
     * @example
     * ```ts
     * fields: [
     *   { name: 'description', type: 'textarea' },
     *   { name: 'maintainer', type: 'relationship', relationTo: 'users' },
     * ]
     * ```
     */
    fields?: Field[];
    /**
     * Extra fields appended to the per-icon `row` inside `iconsArray`, after
     * the existing `name` + `icon` fields. Use for per-icon metadata that
     * should travel with each icon entry (aliases, category, description).
     *
     * @example
     * ```ts
     * iconRowFields: [
     *   { name: 'aliases', type: 'text', hasMany: true, admin: { width: '50%' } },
     *   { name: 'category', type: 'select', options: ['ui', 'brand'] },
     * ]
     * ```
     */
    iconRowFields?: Field[];
}
/**
 * Builds the `IconSet` collection — a versioned, draft-enabled grouping of
 * `Icon` documents with APF `active` toggle and optional live preview.
 *
 * Revalidation is wired via `@pro-laico/core` hooks
 * (`revalidateCacheCollectionAfterChange` on `afterChange`, `revalidateCacheOnDelete`
 * on `afterDelete`); no dependency on `@pro-laico/atomic`. To opt into
 * atomicHook snapshot behavior, attach it via {@link IconSetCollectionOptions.hooks}.
 *
 * Use this factory directly when you need to wire `livePreviewUrl` for a
 * specific project; for the no-arg default, import {@link IconSet} instead.
 *
 * @example
 * ```ts
 * createIconSetCollection({
 *   livePreviewUrl: ({ data, req }) => generateLivePreviewPath({ data, req }),
 *   fields: [{ name: 'description', type: 'textarea' }],
 * })
 * ```
 */
export declare const createIconSetCollection: (opts?: IconSetCollectionOptions) => CollectionConfig;
/**
 * Default `IconSet` collection with no live preview wired. Equivalent to
 * `createIconSetCollection()`. Built-in revalidation hooks from
 * `@pro-laico/core` are always attached.
 *
 * For live preview, additive hooks, or extra fields, use
 * {@link createIconSetCollection}; for plugin-level wiring, use `iconsPlugin`
 * with `iconSetOptions`.
 */
export declare const IconSet: CollectionConfig;
//# sourceMappingURL=iconSet.d.ts.map