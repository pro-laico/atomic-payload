import type { CollectionConfig, Config, GlobalConfig, Plugin } from 'payload'

import { mergeCollection, mergeGlobal } from '@pro-laico/core'

import { createFontCollection } from './collections/font'
import { createFontFileCollection, FONT_FILE_SLUG, type FontOptimizeConfig } from './collections/fontFile'
import { createFontOriginalCollection, FONT_ORIGINAL_SLUG } from './collections/fontOriginal'
import { FontSet, FONT_SET_SLUG } from './globals/fontSet'
import { exportFontsEndpoint } from './endpoints/exportFonts'

/**
 * Field-size cap (bytes) for the multipart `_payload` field when the uploader is
 * on — comfortably above the uploader's `MAX_PENDING_BYTES` client guard (3 MB raw
 * ≈ 4 MB base64) so busboy never truncates the staged payload. The real ceiling is
 * the platform request-body limit (~4.5 MB on Vercel), enforced client-side.
 */
const STAGE_FIELD_SIZE_LIMIT = 8 * 1024 * 1024

/**
 * Optimize-on-upload configuration for the weight files (`fontFile`). Pass `true`
 * for the defaults (convert + subset to WOFF2, Latin charset, archive the
 * original). Use the object form to tune it.
 */
export type FontsOptimizeOption =
  | boolean
  | {
      /** Defaults to true when the object form is given. */
      enabled?: boolean
      /**
       * Characters the subsetter keeps. A preset name (`'latin'` — ASCII +
       * Latin-1 + common punctuation, the default; or `'latin-ext'`) or an
       * explicit string of characters to retain.
       */
      charset?: 'latin' | 'latin-ext' | (string & {})
      /** Keep the untouched original in a sibling collection. Defaults to true. */
      keepOriginal?: boolean
      /** Slug of the archival collection. Defaults to `'fontOriginal'`. */
      originalCollectionSlug?: string
    }

export interface FontsPluginOptions {
  /** When false, the plugin is a no-op. Defaults to true. */
  enabled?: boolean
  /**
   * Convert each uploaded weight file to a subsetted WOFF2 on save (on the
   * `fontFile` collection), keeping the original and reporting the size
   * reduction. **Off by default.** Requires the optional `subset-font` (and, for
   * weight/style detection, `fontkit`) peer deps. When enabled with
   * `keepOriginal`, the `fontOriginal` collection is registered and MUST be added
   * to your storage adapter's collections map, and font uploads must be
   * server-side (client-side direct uploads bypass the optimize hook).
   */
  optimize?: FontsOptimizeOption
  /**
   * Render the premium drag-1-or-many uploader on the `Font` (typeface) document
   * — it builds the typeface's `files` (creating optimized `fontFile`s) instead
   * of a native relationship picker, and hides the raw picker + the `fontFile`
   * collection from nav. Defaults to `true`.
   */
  uploader?: boolean
  /**
   * Merged onto the `Font` (typeface) collection. `Font` is NOT an upload
   * collection — file-upload config (`upload.staticDir`/`mimeTypes`) belongs on
   * {@link fontFileOptions}.
   */
  fontOptions?: Partial<CollectionConfig>
  /**
   * Merged onto the `fontFile` (weight-file upload) collection — e.g.
   * `upload: { staticDir }`. Deep-merged like `fontOptions`.
   */
  fontFileOptions?: Partial<CollectionConfig>
  /**
   * Register the standalone `fontSet` global — the active font selection for
   * projects that don't use `@pro-laico/styles`'s designSet. Defaults to `false`.
   */
  includeFontSet?: boolean
  /** Merged onto the `fontSet` global when {@link includeFontSet} is true. */
  fontSetOptions?: Partial<GlobalConfig>
}

/** Normalize the public `optimize` option to the collection factory's config. */
const resolveOptimize = (optimize: FontsOptimizeOption | undefined): FontOptimizeConfig => {
  if (!optimize) return false
  if (optimize === true) return {}
  if (optimize.enabled === false) return false
  return { charset: optimize.charset, keepOriginal: optimize.keepOriginal, originalCollectionSlug: optimize.originalCollectionSlug }
}

export const fontsPlugin =
  (opts: FontsPluginOptions = {}): Plugin =>
  (config: Config): Config => {
    const { enabled = true, optimize, uploader, fontOptions, fontFileOptions, includeFontSet = false, fontSetOptions } = opts
    if (!enabled) return config

    const resolvedOptimize = resolveOptimize(optimize)
    // The typeface-builder uploader is core to the model; on by default.
    const useUploader = uploader ?? true

    // The uploader stages each weight file as base64 in the typeface's
    // `pendingUploads` field, which rides the admin's multipart save inside the
    // single `_payload` form field. Busboy caps a non-file field at 1 MB by
    // default, silently truncating several fonts' base64 ("Unterminated string in
    // JSON"). Raise that cap so the staged payload fits; the uploader's own client
    // guard keeps the batch under the platform request-body limit. Only ever raised
    // — a higher consumer-set value wins.
    const upload: Config['upload'] = useUploader
      ? {
          ...config.upload,
          limits: { ...config.upload?.limits, fieldSize: Math.max(config.upload?.limits?.fieldSize ?? 0, STAGE_FIELD_SIZE_LIMIT) },
        }
      : config.upload

    const collections = [
      ...(config.collections ?? []),
      mergeCollection(createFontCollection({ uploader: useUploader, fontFileSlug: FONT_FILE_SLUG }), fontOptions),
      mergeCollection(createFontFileCollection({ optimize: resolvedOptimize, hidden: useUploader }), fontFileOptions),
    ]

    // The archival collection is only needed when optimization keeps originals.
    if (resolvedOptimize && resolvedOptimize.keepOriginal !== false) {
      const slug = resolvedOptimize.originalCollectionSlug || FONT_ORIGINAL_SLUG
      collections.push(createFontOriginalCollection({ slug }))
    }

    const globals = includeFontSet ? [...(config.globals ?? []), mergeGlobal(FontSet, fontSetOptions)] : config.globals
    const endpoints = [
      ...(config.endpoints ?? []),
      exportFontsEndpoint({ fontSetGlobalSlug: FONT_SET_SLUG, fontCollectionSlug: 'font', fontFileCollectionSlug: FONT_FILE_SLUG }),
    ]

    return { ...config, collections, globals, endpoints, upload }
  }

export default fontsPlugin
