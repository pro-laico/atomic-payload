import type { CollectionConfig, CollectionSlug, Field } from 'payload'

import { authd } from '../access/authd'
import { cleanupFontFilesHook } from '../hooks/optimizeFont'
import { deleteDereferencedFontFiles, processPendingFontFiles } from '../hooks/pendingFontFiles'
import { uniqueWeightHook } from '../hooks/uniqueWeight'
import { FONT_FILE_SLUG } from './fontFile'

/** Admin component subpath export, referenced by the Payload import map. */
export const FontUploaderPath = '@pro-laico/fonts/admin/fontUploader'

export interface CreateFontCollectionOptions {
  /**
   * Render the premium drag-1-or-many uploader (a `ui` field) that builds this
   * typeface's `files`, and hide the native `files` relationship picker. Default
   * is decided by the plugin. When false, the `files` picker is shown directly.
   */
  uploader?: boolean
  /** Slug of the weight-file collection the typeface references. Default 'fontFile'. */
  fontFileSlug?: string
}

/**
 * The `Font` collection — ONE document per **typeface** (e.g. "Inter"). It is
 * NOT an upload collection: it holds the typeface's weight/style files through
 * the `files` relationship to `fontFile` (each of those IS an optimized upload).
 * The four role slots (sans/serif/mono/display) select one typeface each, and
 * the download generator emits a single `next/font/local` declaration per role
 * with one `src` entry per file.
 *
 * The premium uploader (`fontUploader` ui field) creates the `fontFile`s and
 * populates `files`; the native picker is hidden when the uploader is on.
 */
export const createFontCollection = (opts: CreateFontCollectionOptions = {}): CollectionConfig => {
  const { uploader = true } = opts
  const fontFileSlug = opts.fontFileSlug || FONT_FILE_SLUG

  const fields: Field[] = [
    // `title` is the single source of truth for the typeface name (the uploader
    // auto-fills it from the font's detected family).
    { name: 'title', type: 'text', required: true, label: 'Typeface name' },
    {
      name: 'family',
      type: 'radio',
      required: true,
      label: 'Preferred Family',
      interfaceName: 'GenericFontFamily',
      options: ['sans', 'serif', 'mono', 'display'],
    },
    {
      name: 'files',
      type: 'relationship',
      relationTo: fontFileSlug as CollectionSlug,
      hasMany: true,
      label: 'Weight files',
      // When the uploader is on, the drag-and-drop component IS this field's UI
      // (it creates the optimized files, manages the value, and validates) — no
      // separate ui field, no raw relationship picker. Off → the native picker.
      ...(uploader
        ? { admin: { components: { Field: { path: FontUploaderPath } } } }
        : { admin: { description: 'Ordered weight/style files for this typeface.' } }),
    },
    // Files the uploader staged this session (base64) — created into `fontFile`s
    // by `processPendingFontFiles` on save, then cleared so nothing persists here.
    ...(uploader ? [{ name: 'pendingUploads', type: 'json' as const, admin: { hidden: true, disableBulkEdit: true } }] : []),
  ]

  return {
    slug: 'font',
    access: { create: authd, delete: authd, read: authd, update: authd },
    admin: { group: 'Assets', useAsTitle: 'title', enableListViewSelectAPI: true, defaultColumns: ['title', 'family'] },
    timestamps: true,
    fields,
    hooks: {
      // Reject two files at the same (weight, style) within one typeface.
      beforeValidate: [uniqueWeightHook({ fontFileSlug })],
      // Create the optimized weight files from staged uploads as part of the save
      // (so nothing is created until the typeface is actually saved).
      beforeChange: [processPendingFontFiles({ fontFileSlug })],
      // Delete weight files removed on edit (deferred to save, not on click).
      afterChange: [deleteDereferencedFontFiles({ fontFileSlug })],
      // Delete the typeface's weight files (which cascade to their originals).
      afterDelete: [cleanupFontFilesHook({ fontFileSlug })],
    },
  }
}

/** Default `Font` (typeface) collection. */
export const Font: CollectionConfig = createFontCollection()
