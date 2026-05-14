import type { Config, Plugin } from 'payload'
import { createDesignSetCollection, type DesignSetCollectionOptions } from './designSet/createCollection'
import { createShortcutSetCollection, type ShortcutSetCollectionOptions } from './shortcutSet/createCollection'

/** Omit hook + preview: those always come from the parent `designSetsPlugin` options. */
export type DesignSetsShortcutSetOptions = Partial<
  Omit<ShortcutSetCollectionOptions, 'atomicHook' | 'generateLivePreviewPath'>
> & {
  /** When false, the `shortcutSet` collection is not registered. Defaults to true. */
  enabled?: boolean
}

export type DesignSetsPluginOptions = DesignSetCollectionOptions & {
  /** When false, the plugin does not register the `designSet` collection. Defaults to true. */
  enabled?: boolean
  /**
   * When false, the `shortcutSet` collection is not registered.
   * When an object, shallow-merged with hook + preview from this plugin call.
   */
  shortcutSet?: false | DesignSetsShortcutSetOptions
}

/**
 * Registers the `designSet` collection and (by default) the `shortcutSet` collection.
 * Requires `atomicHook` and `generateLivePreviewPath` from the host app.
 */
export const designSetsPlugin =
  (opts: DesignSetsPluginOptions): Plugin =>
  (config: Config): Config => {
    const { enabled = true, shortcutSet: shortcutSetOpt, ...collectionOpts } = opts
    if (!enabled) return config

    const collections = [...(config.collections ?? [])]

    collections.push(createDesignSetCollection(collectionOpts))

    if (shortcutSetOpt !== false) {
      const slice: DesignSetsShortcutSetOptions =
        shortcutSetOpt && typeof shortcutSetOpt === 'object' ? shortcutSetOpt : {}
      if (slice.enabled !== false) {
        const { enabled: _e, access, collection, defaultShortcuts } = slice
        collections.push(
          createShortcutSetCollection({
            atomicHook: collectionOpts.atomicHook,
            generateLivePreviewPath: collectionOpts.generateLivePreviewPath,
            ...(access !== undefined ? { access } : {}),
            ...(collection !== undefined ? { collection } : {}),
            ...(defaultShortcuts !== undefined ? { defaultShortcuts } : {}),
          }),
        )
      }
    }

    return { ...config, collections }
  }

export default designSetsPlugin
