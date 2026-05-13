export { iconsPlugin, default } from './plugin'
export type { IconsPluginOptions } from './plugin'

export { Icon } from './collections/icon'
export { IconSet, createIconSetCollection } from './collections/iconSet'
export type { IconSetCollectionOptions } from './collections/iconSet'
export { formatSvg, formatSVGHook } from './hooks/formatSVG'
export { extractSvgContent, extractSvgProps } from './utilities/extractSVG'
export { AtomicIcon } from './components/frontend/AtomicIcon'

/** Admin import-map path for the Icon row label. */
export const IconLabelPath = '@pro-laico/atomic-payload-icons/admin/iconRowLabel'
