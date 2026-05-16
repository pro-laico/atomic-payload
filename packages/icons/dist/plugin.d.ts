import type { Plugin, CollectionConfig } from 'payload';
import { type IconCollectionOptions } from './collections/icon';
import { type IconSetCollectionOptions } from './collections/iconSet';
/**
 * Options for {@link iconsPlugin}. Composes the `Icon` upload collection and
 * the `IconSet` grouping collection.
 *
 * @example
 * ```ts
 * import { iconsPlugin } from '@pro-laico/icons'
 * import { atomicHook } from '@pro-laico/atomic/hook'
 *
 * iconsPlugin({
 *   iconOptions: {
 *     fields: [{ name: 'note', type: 'text' }],
 *     hooks: { afterChange: [myHook] },
 *   },
 *   iconSetOptions: {
 *     atomicHook,
 *     livePreviewUrl,
 *     iconRowFields: [{ name: 'aliases', type: 'text', hasMany: true }],
 *   },
 * })
 * ```
 */
export interface IconsPluginOptions {
    /**
     * When `false`, the plugin is a no-op — neither `Icon` nor `IconSet` is
     * registered. Useful behind a feature flag.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Extension points for the `Icon` upload collection — additive hooks,
     * appended top-level fields, and a final shallow-merge escape hatch.
     *
     * See {@link IconCollectionOptions} for the full surface.
     */
    iconOptions?: IconCollectionOptions;
    /**
     * When `false`, the `IconSet` collection is not registered (only `Icon`).
     * Use when you want icons in the CMS but don't need the grouping concept.
     *
     * @default true
     */
    includeIconSet?: boolean;
    /**
     * Extension points for the `IconSet` collection — atomicHook + live
     * preview wiring, additive hooks, set-level fields, per-icon-row fields,
     * and admin label overrides.
     *
     * See {@link IconSetCollectionOptions} for the full surface.
     */
    iconSetOptions?: IconSetCollectionOptions;
    /**
     * Legacy shallow-merge override of the entire `Icon` collection.
     *
     * @remarks
     * Touching `fields` or `hooks` here REPLACES the built-ins
     * (`formatSVGHook`, `revalidateCacheCollection`, `revalidateCacheOnDelete`)
     * because a shallow merge clobbers nested arrays. Applied AFTER
     * {@link iconOptions}, so it still wins when both are provided.
     *
     * @deprecated Prefer the additive options on {@link iconOptions}:
     * {@link IconCollectionOptions.fields},
     * {@link IconCollectionOptions.hooks},
     * or {@link IconCollectionOptions.collection} for the same escape-hatch
     * behavior scoped to a single key.
     */
    iconCollection?: Partial<CollectionConfig>;
}
/**
 * Payload plugin that contributes the `Icon` upload collection and (by
 * default) the `IconSet` grouping collection.
 *
 * - **`Icon`** — single-SVG uploads. Runs `formatSVGHook` (svgo + viewBox
 *   tightening) on `beforeChange`, plus the standard cache-revalidation hooks
 *   on save and delete.
 * - **`IconSet`** — named buckets of icons, with versions/drafts, APF
 *   `active` toggle, and optional atomicHook + live preview wiring.
 *
 * Both collections support additive extension — see
 * {@link IconCollectionOptions} and {@link IconSetCollectionOptions}. User
 * hooks always run AFTER the built-ins, and extra fields land in the most
 * natural location for their shape.
 *
 * @example
 * ```ts
 * import { buildConfig } from 'payload'
 * import { iconsPlugin } from '@pro-laico/icons'
 *
 * export default buildConfig({
 *   plugins: [
 *     iconsPlugin({
 *       iconSetOptions: {
 *         atomicHook,
 *         livePreviewUrl,
 *         fields: [{ name: 'description', type: 'textarea' }],
 *       },
 *     }),
 *   ],
 * })
 * ```
 */
export declare const iconsPlugin: (opts?: IconsPluginOptions) => Plugin;
export default iconsPlugin;
//# sourceMappingURL=plugin.d.ts.map