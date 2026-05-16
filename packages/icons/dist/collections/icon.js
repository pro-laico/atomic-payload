import { authd } from '../access/authenticated';
import { formatSVGHook } from '../hooks/formatSVG';
import { mergeHooks, revalidateCacheCollection, revalidateCacheOnDelete } from '@pro-laico/core';
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
export const createIconCollection = (opts = {}) => {
    const { hooks: extraHooks, fields: extraFields = [], collection: merge } = opts;
    const base = {
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
        hooks: mergeHooks({ beforeChange: [formatSVGHook, revalidateCacheCollection], afterDelete: [revalidateCacheOnDelete] }, extraHooks),
    };
    return merge ? { ...base, ...merge } : base;
};
/**
 * Default `Icon` upload collection with no extensions applied. Equivalent to
 * `createIconCollection()`. Import this when you don't need extensibility
 * (e.g. you're registering it directly without the plugin).
 *
 * For additive extensions, prefer {@link createIconCollection}; for
 * plugin-level wiring, prefer the `iconsPlugin` with `iconOptions`.
 */
export const Icon = createIconCollection();
//# sourceMappingURL=icon.js.map