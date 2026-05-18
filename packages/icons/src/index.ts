export type { IconCollectionOptions } from './collections/icon'
export { createIconCollection, Icon } from './collections/icon'
export type { IconSetCollectionOptions } from './collections/iconSet'
export { createIconSetCollection, IconSet } from './collections/iconSet'
export { AtomicIcon } from './components/frontend/AtomicIcon'
export { formatSVGHook, formatSvg } from './hooks/formatSVG'
export * from './iconSet/defaults'
export type { IconsPluginOptions } from './plugin'
export { default, iconsPlugin } from './plugin'
export { extractSvgContent, extractSvgProps } from './utilities/extractSVG'

/** Admin import-map path for the Icon row label. */
export const IconLabelPath = '@pro-laico/icons/admin/iconRowLabel'
