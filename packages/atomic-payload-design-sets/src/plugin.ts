import type { Config, Plugin, CollectionConfig } from 'payload'

export interface DesignSetsPluginOptions {
  enabled?: boolean
  /** The DesignSet collection config to register. */
  designSet?: CollectionConfig
  /** The ShortcutSet collection config to register. Pass false to skip. */
  shortcutSet?: CollectionConfig | false
}

/**
 * Registers the supplied DesignSet (and optionally ShortcutSet) collection
 * configs onto Payload.
 *
 * NOTE: the collection schemas still live in the consuming template because
 * they depend on template-only field utilities (APField wiring, ActiveField,
 * UniqueTitleField, generateLivePreviewPath, design-token row labels). A
 * subsequent release will move those dependencies and the schema definitions
 * into this package.
 */
export const designSetsPlugin =
  (opts: DesignSetsPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, designSet, shortcutSet } = opts
    if (!enabled) return config
    const additions: CollectionConfig[] = []
    if (designSet) additions.push(designSet)
    if (shortcutSet) additions.push(shortcutSet)
    if (additions.length === 0) return config
    return { ...config, collections: [...(config.collections ?? []), ...additions] }
  }

export default designSetsPlugin
