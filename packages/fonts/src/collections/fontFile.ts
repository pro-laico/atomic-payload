import type { CollectionConfig, CollectionSlug, Field } from 'payload'

import { authd } from '../access/authd'
import { cleanupOriginalHook, optimizeFontHook } from '../hooks/optimizeFont'
import { FONT_MIME_TYPES, FONT_ORIGINAL_SLUG } from './fontOriginal'

/** Slug of the optimized weight-file upload collection. */
export const FONT_FILE_SLUG = 'fontFile'

/** Standard `next/font/local` weight steps offered by the `weight` select. */
const WEIGHT_OPTIONS = ['100', '200', '300', '400', '500', '600', '700', '800', '900']

/** Resolved optimization config, or `false` when optimization is off. */
export type FontOptimizeConfig =
  | false
  | {
      /** Characters to keep, or a preset name ('latin' | 'latin-ext'). Default 'latin'. */
      charset?: string
      /** Archive the untouched upload alongside the optimized file. Default true. */
      keepOriginal?: boolean
      /** Slug of the archival upload collection. Default 'fontOriginal'. */
      originalCollectionSlug?: string
    }

export interface CreateFontFileCollectionOptions {
  /**
   * When set to an object, convert + subset each uploaded weight file to WOFF2 on
   * save (the `optimizeFontHook`), auto-detect weight/style/family, report the size
   * reduction, and — if `keepOriginal` — archive the untouched original. `false`
   * leaves it a plain font-upload store.
   */
  optimize?: FontOptimizeConfig
  /** Hide from admin nav + relationship pickers (the uploader manages these). Default true. */
  hidden?: boolean
}

/**
 * The optimized weight/style files of a typeface — one upload document per
 * physical file. A `Font` (typeface) document references many of these through
 * its `files` relationship; the premium uploader creates them and never exposes
 * them for manual picking (hence `admin.hidden`).
 *
 * This carries the optimization machinery that used to live on `Font` (before
 * `Font` became a non-upload typeface): the `optimizeFontHook` subsets the upload
 * to WOFF2, detects weight/style/family via fontkit, archives the original, and
 * records the size report.
 */
export const createFontFileCollection = (opts: CreateFontFileCollectionOptions = {}): CollectionConfig => {
  const { optimize, hidden = true } = opts
  // Narrow `false` → `undefined` so property access is a clean optional chain.
  const cfg = optimize || undefined
  const originalCollectionSlug = cfg?.originalCollectionSlug || FONT_ORIGINAL_SLUG
  const keepOriginal = cfg?.keepOriginal !== false

  const baseFields: Field[] = [
    // Auto-detected from the font's metadata on upload (fontkit) when optimization
    // is on; the uploader reads `familyName` back to name the typeface.
    { name: 'weight', type: 'select', options: WEIGHT_OPTIONS, admin: { description: 'CSS font-weight for this file.' } },
    { name: 'style', type: 'radio', options: ['normal', 'italic'], admin: { description: 'CSS font-style for this file.' } },
    { name: 'familyName', type: 'text', admin: { readOnly: true, condition: (data) => Boolean(data?.familyName) } },
  ]

  // Readonly optimization report fields — only meaningful when optimization runs.
  const optimizeFields: Field[] = [
    { name: 'optimized', type: 'text', admin: { readOnly: true, condition: (data) => Boolean(data?.optimized) } },
    { name: 'originalFilesize', type: 'number', admin: { readOnly: true, condition: (data) => Boolean(data?.originalFilesize) } },
    { name: 'optimizedFilesize', type: 'number', admin: { readOnly: true, condition: (data) => Boolean(data?.optimizedFilesize) } },
    { name: 'savedPercent', type: 'number', admin: { readOnly: true, condition: (data) => data?.savedPercent != null } },
    ...(keepOriginal
      ? [
          {
            name: 'original',
            type: 'upload' as const,
            relationTo: originalCollectionSlug as CollectionSlug,
            admin: { readOnly: true, condition: (data: Record<string, unknown>) => Boolean(data?.original) },
          },
        ]
      : []),
  ]

  return {
    slug: FONT_FILE_SLUG,
    access: { create: authd, delete: authd, read: authd, update: authd },
    admin: { group: 'Assets', hidden, useAsTitle: 'filename', defaultColumns: ['filename', 'weight', 'style', 'optimizedFilesize'] },
    timestamps: true,
    upload: { mimeTypes: FONT_MIME_TYPES },
    fields: optimize ? [...baseFields, ...optimizeFields] : baseFields,
    hooks: optimize
      ? {
          beforeOperation: [optimizeFontHook({ charset: cfg?.charset, keepOriginal, originalCollectionSlug })],
          ...(keepOriginal ? { afterDelete: [cleanupOriginalHook({ originalCollectionSlug })] } : {}),
        }
      : {},
  }
}

/** Default `fontFile` collection (no optimization). */
export const FontFile: CollectionConfig = createFontFileCollection()
