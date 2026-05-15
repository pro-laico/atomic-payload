import { imagesPlugin } from '@pro-laico/ap-images'

// Registers the Images and Favicons collections, and (optionally) wires the
// `@oversightstudio/blur-data-urls` plugin against the Images collection.
// Pass `blurDataUrls: false` to disable, or `blurOptions: { ... }` to tune.
export const imagesPluginConfig = imagesPlugin({ enabled: true })
