import type { Config, Plugin, CollectionConfig } from 'payload'
import { Icon } from './collections/icon'
import { createIconSetCollection, type IconSetCollectionOptions } from './collections/iconSet'

export interface IconsPluginOptions {
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
  /** Override the Icon collection (merged shallow). */
  iconCollection?: Partial<CollectionConfig>
  /** When true (default), registers the IconSet collection. */
  includeIconSet?: boolean
  /** Options forwarded to `createIconSetCollection`. */
  iconSetOptions?: IconSetCollectionOptions
}

/**
 * Payload plugin that contributes the Icon and (optionally) IconSet collections.
 * Pass `iconSetOptions.atomicHook` and `iconSetOptions.livePreviewUrl` to wire
 * the icon set into your project's atomic-hook / live preview flow.
 */
export const iconsPlugin =
  (opts: IconsPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, iconCollection, includeIconSet = true, iconSetOptions } = opts
    if (!enabled) return config

    const icon: CollectionConfig = iconCollection ? { ...Icon, ...iconCollection } : Icon
    const additions: CollectionConfig[] = [icon]
    if (includeIconSet) additions.push(createIconSetCollection(iconSetOptions))

    return { ...config, collections: [...(config.collections ?? []), ...additions] }
  }

export default iconsPlugin
