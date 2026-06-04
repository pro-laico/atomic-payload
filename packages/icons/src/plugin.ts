import type { CollectionConfig, Config, Plugin } from 'payload'

import { createIconCollection, type IconCollectionOptions } from './collections/icon'
import { createIconSetCollection, type IconSetCollectionOptions } from './collections/iconSet'

/**
 * Options for {@link iconsPlugin}. Composes the `Icon` upload collection and
 * the `IconSet` grouping collection.
 *
 * @example
 * ```ts
 * import { iconsPlugin } from '@pro-laico/icons'
 *
 * iconsPlugin({
 *   iconOptions: {
 *     fields: [{ name: 'note', type: 'text' }],
 *     hooks: { afterChange: [myHook] },
 *   },
 *   iconSetOptions: {
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
  enabled?: boolean
  /**
   * Extension points for the `Icon` upload collection — additive hooks,
   * appended top-level fields, and a final shallow-merge escape hatch.
   *
   * See {@link IconCollectionOptions} for the full surface.
   */
  iconOptions?: IconCollectionOptions
  /**
   * When `false`, the `IconSet` collection is not registered (only `Icon`).
   * Use when you want icons in the CMS but don't need the grouping concept.
   *
   * @default true
   */
  includeIconSet?: boolean
  /**
   * Extension points for the `IconSet` collection — live preview wiring,
   * additive hooks, set-level fields, per-icon-row fields, and admin label
   * overrides.
   *
   * See {@link IconSetCollectionOptions} for the full surface.
   */
  iconSetOptions?: IconSetCollectionOptions
}

/**
 * Payload plugin that contributes the `Icon` upload collection and (by
 * default) the `IconSet` grouping collection.
 *
 * - **`Icon`** — single-SVG uploads. Runs `formatSVGHook` (svgo + viewBox
 *   tightening) on `beforeChange`, plus the standard cache-revalidation hooks
 *   on save and delete.
 * - **`IconSet`** — named buckets of icons, with versions/drafts, APF
 *   `active` toggle, and optional live preview wiring.
 *
 * Both collections wire cache revalidation through `@pro-laico/core` hooks
 * only — the `Icon`/`IconSet` collections themselves carry no runtime dependency
 * on `@pro-laico/atomic`. (The package as a whole does: the `iconChild`/`svgChild`
 * block components render via `@pro-laico/atomic/children`, so `@pro-laico/atomic`
 * is a genuine runtime dependency — see `package.json`.) For atomicHook
 * snapshot behavior, attach it yourself via `iconSetOptions.hooks.beforeChange`.
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
 *         livePreviewUrl,
 *         fields: [{ name: 'description', type: 'textarea' }],
 *       },
 *     }),
 *   ],
 * })
 * ```
 */
export const iconsPlugin =
  (opts: IconsPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, iconOptions, includeIconSet = true, iconSetOptions } = opts
    if (!enabled) return config

    const additions: CollectionConfig[] = [createIconCollection(iconOptions)]
    if (includeIconSet) additions.push(createIconSetCollection(iconSetOptions))

    return { ...config, collections: [...(config.collections ?? []), ...additions] }
  }

export default iconsPlugin
