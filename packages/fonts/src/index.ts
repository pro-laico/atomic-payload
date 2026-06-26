export { extractFonts } from './extractFonts'
export { exportFontsEndpoint } from './endpoints/exportFonts'
export type { ExportedFont, ExportFontsResponse, ExportFontsEndpointOptions } from './endpoints/exportFonts'
export { fontUploadField, fontUploadFields } from './fields/font'

export { createFontCollection, Font, FontOriginalUploadPath } from './collections/font'
export type { CreateFontCollectionOptions } from './collections/font'
export { createFontOriginalCollection, FontOriginal, FONT_ORIGINAL_SLUG, FONT_MIME_TYPES } from './collections/fontOriginal'
export { createFontOptimizedCollection, FontOptimized, FONT_OPTIMIZED_SLUG } from './collections/fontOptimized'
export type { CreateFontOptimizedCollectionOptions } from './collections/fontOptimized'
export { createFontSetGlobal, FontSet, FONT_SET_SLUG } from './globals/fontSet'

export { resolveCharsetText, detectMetadata, subsetToWoff2 } from './hooks/optimizeFont'
export { optimizeFromOriginalsHook, cleanupFontAssetsHook } from './hooks/optimizeFromOriginals'
export type { OptimizeFromOriginalsOptions } from './hooks/optimizeFromOriginals'
export { readUploadBytes } from './lib/uploadBytes'

export { default, fontsPlugin } from './plugin'
export type { FontsPluginOptions } from './plugin'
