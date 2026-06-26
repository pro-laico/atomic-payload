import { APIError, type ArrayField, type CollectionBeforeValidateHook, type CollectionConfig, type CollectionSlug, type Field } from 'payload'

import { authd } from '../access/authd'
import { cleanupFontAssetsHook, optimizeFromOriginalsHook, originalIdsFromDoc } from '../hooks/optimizeFromOriginals'
import { FONT_OPTIMIZED_SLUG } from './fontOptimized'
import { FONT_ORIGINAL_SLUG } from './fontOriginal'

/** Standard `next/font/local` weight steps offered by each weight row. */
const WEIGHT_OPTIONS = ['100', '200', '300', '400', '500', '600', '700', '800', '900']

/** Admin component subpath (Payload import map) for the create-only original uploader. */
export const FontOriginalUploadPath = '@pro-laico/fonts/admin/fontOriginalUpload'
/**
 * A FRESH admin config that renders the `fontOriginal` slot create-only (no "Choose
 * from existing"), so every slot uploads a fresh original — never shared between
 * typefaces. A factory (not a shared object) because Payload mutates field configs
 * in place during sanitization; sharing one reference across slots corrupts it.
 */
const createOnlyUpload = () => ({ components: { Field: { path: FontOriginalUploadPath } } })

export interface CreateFontCollectionOptions {
  /** Characters the subsetter keeps, or a preset ('latin' | 'latin-ext'). Default 'latin'. */
  charset?: string
  /** Slug of the archival original upload collection. Default 'fontOriginal'. */
  originalSlug?: string
  /** Slug of the optimized (served) upload collection. Default 'fontOptimized'. */
  optimizedSlug?: string
}

type VariableGroup = { upright?: unknown; italic?: unknown }
const hasVariable = (data: Record<string, unknown> | undefined): boolean => {
  const v = (data?.variable ?? {}) as VariableGroup
  return Boolean(v.upright || v.italic)
}
const hasWeights = (data: Record<string, unknown> | undefined): boolean =>
  Array.isArray(data?.weights) && (data.weights as Array<{ file?: unknown }>).some((w) => w?.file)

/**
 * `beforeValidate`: a typeface needs at least one file, and can't mix a variable
 * font with specific weights (you compose from one or the other). Runs on create
 * and on any update that touches these fields, so an unrelated partial edit is
 * left alone.
 */
const requireFontFiles: CollectionBeforeValidateHook = ({ data, operation }) => {
  const touches = operation === 'create' || (data != null && ('variable' in data || 'weights' in data))
  if (!touches) return data
  if (hasVariable(data) && hasWeights(data)) {
    throw new APIError('Use either a variable font or specific weight files, not both.', 400, null, true)
  }
  if (!hasVariable(data) && !hasWeights(data)) {
    throw new APIError('Add at least one font file before saving.', 400, null, true)
  }
  return data
}

/**
 * `beforeValidate`: enforce one `fontOriginal` per typeface — reject a save that
 * references an original already used by ANOTHER typeface. The create-only upload
 * slots make sharing impossible from the admin UI, but this is the data-layer
 * guarantee (covers the REST API, imports, seeds, and a future Payload upgrade that
 * might un-hide "Choose from existing"). It's what makes the direct asset cleanup
 * in {@link cleanupFontAssetsHook} / {@link optimizeFromOriginalsHook} safe: a
 * de-referenced or deleted original is never still in use elsewhere.
 */
const rejectSharedOriginals: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  if (!data || !req?.payload) return data
  const ids = originalIdsFromDoc(data as Record<string, unknown>)
  if (ids.length === 0) return data
  const selfId = (originalDoc as { id?: string | number } | undefined)?.id ?? (data as { id?: string | number }).id
  const refs = [{ 'variable.upright': { in: ids } }, { 'variable.italic': { in: ids } }, { 'weights.file': { in: ids } }]
  const where = selfId != null ? { and: [{ id: { not_equals: selfId } }, { or: refs }] } : { or: refs }
  const res = await req.payload.find({ collection: 'font', where: where as never, depth: 0, limit: 1, overrideAccess: true, req })
  if (res.totalDocs > 0) {
    const other = (res.docs[0] as { title?: string }).title || 'another typeface'
    throw new APIError(
      `That font file is already used by ${other}. Each typeface needs its own upload — add a fresh copy for this slot.`,
      400,
      null,
      true,
    )
  }
  return data
}

/**
 * The `Font` collection — ONE document per **typeface** (e.g. "Inter"). The four
 * role slots (sans/serif/mono/display) select one of these each.
 *
 * It is NOT itself an upload collection. Editors drop font files into standard
 * Payload `upload` fields backed by `fontOriginal` (raw archive) — either the
 * `variable` group (a single variable file per upright/italic) OR the `weights`
 * array (one file per weight/style). On save, {@link optimizeFromOriginalsHook}
 * subsets each referenced original to a served `fontOptimized` WOFF2. The slots are
 * Payload's own upload field, thinly wrapped to be create-only (no "Choose from
 * existing"), so each original belongs to exactly one typeface — keeping asset
 * cleanup safe and race-free.
 */
export const createFontCollection = (opts: CreateFontCollectionOptions = {}): CollectionConfig => {
  const originalSlug = (opts.originalSlug || FONT_ORIGINAL_SLUG) as CollectionSlug
  const optimizedSlug = opts.optimizedSlug || FONT_OPTIMIZED_SLUG

  const fields: Field[] = [
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
      name: 'variable',
      type: 'group',
      label: 'Variable font',
      admin: {
        description: 'One file covering many weights. Use this OR specific weights below — not both.',
        // Hidden once specific weights are added; you compose from one path or the other.
        condition: (data) => !hasWeights(data as Record<string, unknown>),
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'upright', type: 'upload', relationTo: originalSlug, label: 'Upright (normal)', admin: createOnlyUpload() },
            { name: 'italic', type: 'upload', relationTo: originalSlug, label: 'Italic', admin: createOnlyUpload() },
          ],
        },
      ],
    },
    {
      name: 'weights',
      type: 'array',
      label: 'Weights',
      labels: { singular: 'Weight file', plural: 'Weight files' },
      admin: {
        description: 'One file per weight/style. Add only the weights you need.',
        condition: (data) => !hasVariable(data as Record<string, unknown>),
      },
      // Each weight + style must be unique so the generated next/font src array has no conflicts.
      validate: ((rows: Array<{ weight?: string; style?: string }> | null | undefined) => {
        const seen = new Set<string>()
        for (const r of Array.isArray(rows) ? rows : []) {
          const key = `${r?.weight ?? ''}|${r?.style ?? ''}`
          if (seen.has(key)) return `Two files share weight ${r?.weight ?? '?'} ${r?.style ?? 'normal'}. Each weight + style must be unique.`
          seen.add(key)
        }
        return true
      }) as ArrayField['validate'],
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'weight', type: 'select', required: true, defaultValue: '400', options: WEIGHT_OPTIONS },
            { name: 'style', type: 'radio', required: true, defaultValue: 'normal', options: ['normal', 'italic'] },
          ],
        },
        { name: 'file', type: 'upload', relationTo: originalSlug, required: true, admin: createOnlyUpload() },
      ],
    },
  ]

  return {
    slug: 'font',
    access: { create: authd, delete: authd, read: authd, update: authd },
    admin: { group: 'Assets', useAsTitle: 'title', enableListViewSelectAPI: true, defaultColumns: ['title', 'family'] },
    timestamps: true,
    fields,
    hooks: {
      beforeValidate: [requireFontFiles, rejectSharedOriginals],
      // On save, (re)build the served WOFF2 files from the referenced originals (and
      // clean up any original a swapped/removed slot de-referenced).
      afterChange: [optimizeFromOriginalsHook({ charset: opts.charset, originalSlug, optimizedSlug })],
      // On delete, cascade to the served files + the archived originals.
      afterDelete: [cleanupFontAssetsHook({ originalSlug, optimizedSlug })],
    },
  }
}

/** Default `Font` (typeface) collection. */
export const Font: CollectionConfig = createFontCollection()
