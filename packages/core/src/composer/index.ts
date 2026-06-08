import type { CollectionAfterDeleteHook, CollectionBeforeChangeHook, CollectionConfig, Config, GlobalBeforeChangeHook, Plugin } from 'payload'

import { mergeHooks } from '../utilities/mergeHooks'
import { revalidateCache as globalRevalidateCache } from '../hooks/global/revalidate'
import { revalidateCache, revalidateCacheOnDelete } from '../hooks/collection/revalidate'

/**
 * The collection slugs the shared `atomicHook` is attached to by default: the
 * documents that hold atomic content (CSS, forms, actions). Override with
 * `atomicHookSlugs`, or extend with `additionalAtomicHookSlugs`.
 */
export const DEFAULT_ATOMIC_HOOK_SLUGS = ['designSet', 'shortcutSet', 'pages', 'header', 'footer', 'iconSet'] as const

/** Per-phase revalidation override. Each hook defaults to the matching core
 *  dispatcher; pass `false` to skip that phase entirely. The optional slug lists
 *  restrict which collections/globals the hook is attached to (omit a list to
 *  attach to all of them — the dispatcher self-selects by slug anyway). */
export interface PluginComposerRevalidateOptions {
  /** Collection `beforeChange` hook. @default core `revalidateCache` */
  collectionBeforeChange?: CollectionBeforeChangeHook | false
  /** Collection `afterDelete` hook. @default core `revalidateCacheOnDelete` */
  collectionAfterDelete?: CollectionAfterDeleteHook | false
  /** Global `beforeChange` hook. @default core global `revalidateCache` */
  globalBeforeChange?: GlobalBeforeChangeHook | false
  /** Restrict the beforeChange attach to these collection slugs. Omit to attach to all. */
  collectionSlugs?: string[]
  /** Restrict the afterDelete attach to these collection slugs. Omit to attach to all. */
  deleteCollectionSlugs?: string[]
  /** Restrict the global attach to these global slugs. Omit to attach to all. */
  globalSlugs?: string[]
}

/** The cross-cutting wiring the composer applies via its trailing finalizer plugin. */
export interface AtomicWiringOptions {
  /**
   * The cross-cutting `atomicHook` (from `@pro-laico/atomic/hook`). When set, it is
   * attached to every collection in `atomicHookSlugs` on `beforeChange`. Own it here
   * rather than threading it into individual plugins (e.g. don't also pass it to
   * `stylesPlugin`, or it runs twice).
   */
  atomicHook?: CollectionBeforeChangeHook
  /**
   * Collection slugs the shared `atomicHook` is attached to.
   * @default DEFAULT_ATOMIC_HOOK_SLUGS
   */
  atomicHookSlugs?: string[]
  /** Add to the default slug set instead of replacing it. Ignored when `atomicHookSlugs` is set. */
  additionalAtomicHookSlugs?: string[]
  /**
   * Revalidation wiring. By default the finalizer attaches the core revalidation
   * dispatchers to every collection and global; they self-select by slug and no-op
   * when no handler matches, so this needs no hand-maintained slug arrays. Pass an
   * object to override per phase, or `false` to skip revalidation wiring entirely.
   */
  revalidate?: false | PluginComposerRevalidateOptions
}

export interface PluginComposerOptions extends AtomicWiringOptions {
  /**
   * The plugins to compose, in order. The composer returns them followed by a
   * finalizer plugin, so the cross-cutting wiring always runs last and sees the
   * fully-assembled config — including collections registered by third-party
   * plugins (e.g. `@payloadcms/plugin-form-builder`'s `forms`/`form-submissions`).
   */
  plugins: Plugin[]
  /**
   * When `false`, the plugins are returned unchanged (no finalizer appended), so
   * none of the cross-cutting wiring is applied. @default true
   */
  enabled?: boolean
}

/** Append `hook` to a collection's `beforeChange`, skipping if it's already present (by identity). */
const attachCollectionBeforeChange = (collection: CollectionConfig, hook: CollectionBeforeChangeHook): CollectionConfig => {
  if ((collection.hooks?.beforeChange ?? []).includes(hook)) return collection
  return { ...collection, hooks: mergeHooks(collection.hooks ?? {}, { beforeChange: [hook] }) }
}

/**
 * The finalizer plugin: a plain `(config) => config` transform that wires the
 * cross-cutting concerns over the fully-assembled config. The composer appends it
 * after every passed plugin, so it always runs last.
 */
const atomicFinalizer =
  (wiring: AtomicWiringOptions): Plugin =>
  (incoming: Config): Config => {
    let config = incoming

    // 1) Attach the shared atomicHook to the target collection slugs.
    if (wiring.atomicHook) {
      const atomicHook = wiring.atomicHook
      const slugs = wiring.atomicHookSlugs ?? [...DEFAULT_ATOMIC_HOOK_SLUGS, ...(wiring.additionalAtomicHookSlugs ?? [])]
      const targets = new Set(slugs)
      config = {
        ...config,
        collections: (config.collections ?? []).map((collection) =>
          targets.has(collection.slug) ? attachCollectionBeforeChange(collection, atomicHook) : collection,
        ),
      }
    }

    // 2) Attach the revalidation dispatchers broadly (or per the override).
    if (wiring.revalidate !== false) {
      const r = typeof wiring.revalidate === 'object' ? wiring.revalidate : {}
      const beforeHook = r.collectionBeforeChange === false ? undefined : (r.collectionBeforeChange ?? revalidateCache)
      const deleteHook = r.collectionAfterDelete === false ? undefined : (r.collectionAfterDelete ?? revalidateCacheOnDelete)
      const globalHook = r.globalBeforeChange === false ? undefined : (r.globalBeforeChange ?? globalRevalidateCache)

      const collections = (config.collections ?? []).map((collection) => {
        const addBefore = beforeHook && (!r.collectionSlugs || r.collectionSlugs.includes(collection.slug))
        const addDelete = deleteHook && (!r.deleteCollectionSlugs || r.deleteCollectionSlugs.includes(collection.slug))
        if (!addBefore && !addDelete) return collection
        return {
          ...collection,
          hooks: mergeHooks(collection.hooks ?? {}, {
            ...(addBefore ? { beforeChange: [beforeHook] } : {}),
            ...(addDelete ? { afterDelete: [deleteHook] } : {}),
          }),
        }
      })

      const globals = (config.globals ?? []).map((global) => {
        const addBefore = globalHook && (!r.globalSlugs || r.globalSlugs.includes(global.slug))
        if (!addBefore) return global
        return { ...global, hooks: mergeHooks(global.hooks ?? {}, { beforeChange: [globalHook] }) }
      })

      config = { ...config, collections, globals }
    }

    return config
  }

/**
 * Compose an Atomic Payload app's plugins. Pass every plugin (including third-party
 * ones) plus the cross-cutting wiring; the composer returns the plugins followed by
 * a finalizer that wires the shared concerns last:
 *
 * - attaches the shared `atomicHook` to the atomic-content collections, and
 * - attaches the revalidation dispatchers to every collection and global.
 *
 * Because the finalizer is appended after every plugin, it always runs last and sees
 * the fully-assembled config — so there are no slug arrays to maintain and no "inside
 * vs outside the composer" ordering trap. Drop the result straight into `buildConfig`:
 *
 * ```ts
 * export const plugins: Plugin[] = pluginComposer({
 *   atomicHook,
 *   plugins: [sitePlugin(), formsPlugin(), formBuilderPluginConfig, vercelBlobStoragePluginConfig],
 * })
 * ```
 *
 * The composer manipulates only the generic Payload `Config` and imports no
 * `@pro-laico` plugin package.
 */
export const pluginComposer = (opts: PluginComposerOptions): Plugin[] => {
  const { plugins, enabled = true, ...wiring } = opts
  if (!enabled) return [...plugins]
  return [...plugins, atomicFinalizer(wiring)]
}

export default pluginComposer
