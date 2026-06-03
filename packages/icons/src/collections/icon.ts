import { mergeHooks, revalidateCacheCollectionAfterChange, revalidateCacheOnDelete } from '@pro-laico/core'
import type { CollectionConfig, Field } from 'payload'

import { authd } from '../access/authenticated'
import { formatSVGHook } from '../hooks/formatSVG'

/**
 * Options for {@link createIconCollection} — the `Icon` SVG upload collection.
 *
 * All three extension points are additive on top of the built-in defaults
 * (slug `icon`, authenticated access, `image/svg+xml` upload, SVG-optimizing
 * `beforeChange` hook, cache revalidation on save + delete).
 *
 * @example
 * ```ts
 * createIconCollection({
 *   fields: [{ name: 'note', type: 'text' }],
 *   hooks: { afterChange: [({ doc }) => doc] },
 * })
 * ```
 */
export interface IconCollectionOptions {
  /**
   * Additional Payload hooks. Each hook array is APPENDED to the built-in
   * hooks — user hooks run AFTER the defaults within their phase:
   *
   * - `beforeChange`: `[formatSVGHook, ...yours]` — your hooks always see the
   *   already-optimized SVG.
   * - `afterChange`: `[revalidateCacheCollectionAfterChange, ...yours]` — cache
   *   is revalidated post-commit.
   * - `afterDelete`: `[revalidateCacheOnDelete, ...yours]`.
   * - Any other phase (`beforeRead`, `afterRead`, …): just your hooks, no built-ins.
   *
   * @example
   * ```ts
   * hooks: {
   *   afterChange: [({ doc, req }) => {
   *     req.payload.logger.info(`Icon saved: ${doc.id}`)
   *     return doc
   *   }],
   * }
   * ```
   */
  hooks?: CollectionConfig['hooks']
  /**
   * Extra fields appended to the top-level `fields` array, after the built-in
   * `optimized` and `svgString` fields. `Icon` is a flat upload collection
   * (no tabs, no rows), so additions just stack.
   *
   * @example
   * ```ts
   * fields: [
   *   { name: 'note', type: 'text' },
   *   { name: 'category', type: 'select', options: ['ui', 'social', 'brand'] },
   * ]
   * ```
   */
  fields?: Field[]
  /**
   * Escape hatch: shallow-merged onto the built collection AFTER `fields` and
   * `hooks` have been applied. Use for non-additive overrides — `admin`,
   * `access`, `upload`, `versions`, etc. Avoid for `fields`/`hooks` since a
   * shallow merge replaces nested arrays (use the dedicated options above).
   *
   * @example
   * ```ts
   * collection: { admin: { group: 'Brand' } }
   * ```
   */
  collection?: Partial<CollectionConfig>
}

type Hooks = NonNullable<CollectionConfig['hooks']>

/**
 * Builds the `Icon` upload collection with optional additive extensions.
 *
 * The resulting collection accepts `image/svg+xml` uploads, optimizes them
 * via `formatSVGHook` on `beforeChange` (svgo + viewBox tightening), and
 * revalidates the cache on save + delete. Pass {@link IconCollectionOptions}
 * to append hooks or fields without losing the defaults.
 *
 * Prefer the exported {@link Icon} const when you need the no-arg default.
 *
 * @example
 * ```ts
 * // With a per-icon note field and a custom afterChange hook.
 * const icon = createIconCollection({
 *   fields: [{ name: 'note', type: 'text' }],
 *   hooks: { afterChange: [myHook] },
 * })
 * ```
 */
export const createIconCollection = (opts: IconCollectionOptions = {}): CollectionConfig => {
  const { hooks: extraHooks, fields: extraFields = [], collection: merge } = opts

  const base: CollectionConfig = {
    slug: 'icon',
    access: { create: authd, delete: authd, read: authd, update: authd },
    admin: { group: 'Assets', useAsTitle: 'filename', enableListViewSelectAPI: true, defaultColumns: ['filename', 'filesize', 'updatedAt'] },
    fields: [
      { type: 'text', name: 'optimized', admin: { readOnly: true, condition: (data) => Boolean(data?.optimized) } },
      {
        type: 'code',
        name: 'svgString',
        admin: { language: 'xml', condition: (data) => Boolean(data?.svgString), editorOptions: { wordWrap: 'off', scrollBeyondLastLine: false } },
      },
      ...extraFields,
    ],
    upload: { mimeTypes: ['image/svg+xml'] },
    hooks: mergeHooks<Hooks>(
      // Revalidate on afterChange (post-commit), not beforeChange — busting the
      // cache before the write lands lets a concurrent read re-cache stale data.
      { beforeChange: [formatSVGHook], afterChange: [revalidateCacheCollectionAfterChange], afterDelete: [revalidateCacheOnDelete] },
      extraHooks,
    ),
  }

  return merge ? { ...base, ...merge } : base
}

/**
 * Default `Icon` upload collection with no extensions applied. Equivalent to
 * `createIconCollection()`. Import this when you don't need extensibility
 * (e.g. you're registering it directly without the plugin).
 *
 * For additive extensions, prefer {@link createIconCollection}; for
 * plugin-level wiring, prefer the `iconsPlugin` with `iconOptions`.
 */
export const Icon: CollectionConfig = createIconCollection()
