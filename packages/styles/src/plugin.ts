import type { CollectionBeforeChangeHook, Config, PayloadRequest, Plugin } from 'payload'
import type { CssProcessorGetCached } from './cssProcessor'
import { createDesignSetCollection, type DesignSetCollectionOptions } from './designSet/createCollection'
import { baseStorage } from './globals/storage'
import { createCssHook, type CssHookOptions } from './hooks/cssHook'
import { createShortcutSetCollection, type ShortcutSetCollectionOptions } from './shortcutSet/createCollection'

/**
 * `designSet` collection activation + settings. The shared `atomicHook`,
 * `cssHook`, and `generateLivePreviewPath` come from the top-level
 * `stylesPlugin` options, so they're omitted here.
 */
export type StylesDesignSetOptions = Partial<Omit<DesignSetCollectionOptions, 'atomicHook' | 'cssHook' | 'generateLivePreviewPath'>> & {
  /** When false, the `designSet` collection is not registered. Defaults to true. */
  enabled?: boolean
}

/** `shortcutSet` collection activation + settings (same shape as `designSet`). */
export type StylesShortcutSetOptions = Partial<Omit<ShortcutSetCollectionOptions, 'atomicHook' | 'cssHook' | 'generateLivePreviewPath'>> & {
  /** When false, the `shortcutSet` collection is not registered. Defaults to true. */
  enabled?: boolean
}

export type StylesPluginOptions = {
  /** Wired to both collections' `hooks.beforeChange` (typically the project `atomicHook`). */
  atomicHook?: CollectionBeforeChangeHook
  /** Same contract as the template `generateLivePreviewPath` helper. Shared by both collections. */
  generateLivePreviewPath: (args: { data: Partial<unknown>; req: PayloadRequest }) => Promise<string> | string
  /** When false, the whole plugin is a no-op. Defaults to true. */
  enabled?: boolean
  /**
   * `designSet` collection activation + settings.
   * - `false` (or `{ enabled: false }`) → don't register the collection.
   * - object → per-collection settings (`access`, `collection`).
   * Defaults to enabled with default settings.
   */
  designSet?: false | StylesDesignSetOptions
  /**
   * `shortcutSet` collection activation + settings (same shape as `designSet`).
   * Defaults to enabled with default settings.
   */
  shortcutSet?: false | StylesShortcutSetOptions
  /**
   * Provide a `getCached` to attach the standalone `cssHook` so this plugin
   * processes CSS on its own (no `@pro-laico/atomic`). When `atomicHook` is also
   * supplied, the cssHook stays inert and atomicHook does the work.
   */
  getCached?: CssProcessorGetCached
  /** Forwarded to `createCssHook` when `getCached` is set (slug/global overrides). */
  cssHookOptions?: CssHookOptions
  /** When false, the plugin does not register the draft/published CSS storage globals. Defaults to true. */
  storageGlobals?: boolean
}

/**
 * Single plugin for CSS processing in Payload. Registers (each individually
 * toggleable) the `designSet` + `shortcutSet` collections, the draft/published
 * CSS storage globals, and — when `getCached` is supplied — a standalone
 * `cssHook` that generates the stored stylesheet. The className field ships in
 * this package too (`@pro-laico/styles/fields/className`).
 *
 * Pass `atomicHook` to delegate CSS (plus forms/actions/APF) to
 * `@pro-laico/atomic`'s all-in-one hook; pass `getCached` (with or without
 * `atomicHook`) to wire the standalone CSS hook. With both, the cssHook is
 * inert and atomicHook processes CSS.
 */
export const stylesPlugin =
  (opts: StylesPluginOptions): Plugin =>
  (config: Config): Config => {
    const {
      enabled = true,
      atomicHook,
      generateLivePreviewPath,
      designSet: designSetOpt,
      shortcutSet: shortcutSetOpt,
      getCached,
      cssHookOptions,
      storageGlobals = true,
    } = opts
    if (!enabled) return config

    const cssHook: CollectionBeforeChangeHook | undefined = getCached ? createCssHook(getCached, cssHookOptions) : undefined

    const collections = [...(config.collections ?? [])]

    if (designSetOpt !== false) {
      const slice: StylesDesignSetOptions = designSetOpt && typeof designSetOpt === 'object' ? designSetOpt : {}
      if (slice.enabled !== false) {
        const { enabled: _enabled, access, collection } = slice
        collections.push(
          createDesignSetCollection({
            atomicHook,
            generateLivePreviewPath,
            cssHook,
            ...(access !== undefined ? { access } : {}),
            ...(collection !== undefined ? { collection } : {}),
          }),
        )
      }
    }

    if (shortcutSetOpt !== false) {
      const slice: StylesShortcutSetOptions = shortcutSetOpt && typeof shortcutSetOpt === 'object' ? shortcutSetOpt : {}
      if (slice.enabled !== false) {
        const { enabled: _enabled, access, collection, defaultShortcuts } = slice
        collections.push(
          createShortcutSetCollection({
            atomicHook,
            generateLivePreviewPath,
            cssHook,
            ...(access !== undefined ? { access } : {}),
            ...(collection !== undefined ? { collection } : {}),
            ...(defaultShortcuts !== undefined ? { defaultShortcuts } : {}),
          }),
        )
      }
    }

    const globals = storageGlobals ? [...(config.globals ?? []), baseStorage('draft'), baseStorage('published')] : config.globals

    return { ...config, collections, globals }
  }

export default stylesPlugin
