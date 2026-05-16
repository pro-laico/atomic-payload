import type { CollectionConfig, CollectionBeforeChangeHook, Field, PayloadRequest } from 'payload';
/**
 * Options for {@link createIconSetCollection} — the `IconSet` collection that
 * groups Icons under a named bucket with versions, drafts, APF `active`
 * support, and optional live preview / atomicHook wiring.
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
 *   atomicHook,
 *   livePreviewUrl,
 *   fields: [{ name: 'description', type: 'textarea' }],
 *   iconRowFields: [{ name: 'aliases', type: 'text', hasMany: true }],
 * })
 * ```
 */
export interface IconSetCollectionOptions {
    /**
     * Project atomicHook attached to `beforeChange`. Wire this when the icon
     * set should participate in your project's atomic-data snapshot (so its
     * data travels with the active design set).
     *
     * When omitted, no atomicHook runs from this factory — you can also attach
     * one externally via `@pro-laico/atomic/hook`'s plugin factory.
     *
     * @example
     * ```ts
     * import { atomicHook } from '@pro-laico/atomic/hook'
     * createIconSetCollection({ atomicHook })
     * ```
     */
    atomicHook?: CollectionBeforeChangeHook;
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
     * - `beforeChange`: `[atomicHook (if provided), ...yours]`
     * - `afterDelete`: `[revalidateCacheOnDelete, ...yours]`
     * - Any other phase (`afterChange`, `beforeRead`, `afterRead`, …): just
     *   your hooks, no built-ins.
     *
     * @example
     * ```ts
     * hooks: { afterRead: [({ doc }) => doc] }
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
 * `Icon` documents with APF `active` toggle, optional live preview, and
 * optional atomicHook wiring.
 *
 * Use this factory directly when you need to wire `atomicHook` /
 * `livePreviewUrl` for a specific project; for a no-arg default that omits
 * both, import the exported {@link IconSet} const instead.
 *
 * @example
 * ```ts
 * createIconSetCollection({
 *   atomicHook,
 *   livePreviewUrl: ({ data, req }) => generateLivePreviewPath({ data, req }),
 *   fields: [{ name: 'description', type: 'textarea' }],
 * })
 * ```
 */
export declare const createIconSetCollection: (opts?: IconSetCollectionOptions) => CollectionConfig;
/**
 * Default `IconSet` collection with no atomicHook and no live preview wired.
 * Equivalent to `createIconSetCollection()`. Import this when you don't need
 * project-specific wiring.
 *
 * For atomicHook / live preview / additive extensions, use
 * {@link createIconSetCollection}; for plugin-level wiring, use `iconsPlugin`
 * with `iconSetOptions`.
 */
export declare const IconSet: CollectionConfig;
//# sourceMappingURL=iconSet.d.ts.map