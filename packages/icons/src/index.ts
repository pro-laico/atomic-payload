export * from './iconSet/defaults'
export { default, iconsPlugin } from './plugin'
export type { IconsPluginOptions } from './plugin'
export { AtomicIcon } from './components/frontend/AtomicIcon'
export { formatSVGHook, formatSvg } from './hooks/formatSVG'
export { createIconCollection, Icon } from './collections/icon'
export type { IconCollectionOptions } from './collections/icon'
export type { IconSetCollectionOptions } from './collections/iconSet'
export { extractSvgContent, extractSvgProps } from './utilities/extractSVG'
export { createIconSetCollection, IconSet } from './collections/iconSet'

/** Admin import-map path for the Icon row label. */
export const IconLabelPath = '@pro-laico/icons/admin/iconRowLabel'
