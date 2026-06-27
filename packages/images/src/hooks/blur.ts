/**
 * LQIP blur-placeholder generation, owned by this package (no external plugin).
 * On upload, the source buffer is shrunk + blurred with Sharp and stored as a base64
 * data URL in the `blurDataUrl` field, which `<ResponsiveImage>` reads to paint a
 * placeholder while the real image loads. `sharp` is a lazy import (optional peer,
 * and kept out of client bundles). Generation is best-effort: a failure logs and
 * leaves the write untouched rather than blocking the upload.
 *
 * The option shape mirrors `@oversightstudio/blur-data-urls`' `blurOptions`
 * (`width` / `height` / `blur`) so the behavior is familiar; the collections list
 * and enable flag from that plugin are dropped here — this package owns the single
 * source collection and the plugin's own `blur` flag is the on/off switch.
 */
import type { CollectionBeforeChangeHook, Payload } from 'payload'

import { loadSharp } from '../transform/sharpInstance'
import { readBytes, resolveStaticDir, type UploadDocLike } from '../transform/source'

export interface BlurOptions {
  /** Width (px) of the generated placeholder. @default 32 */
  width?: number
  /** Height (px), or `'auto'` to preserve the source aspect ratio. @default 'auto' */
  height?: number | 'auto'
  /** Sharp blur sigma applied to the placeholder. @default 18 */
  blur?: number
}

const DEFAULTS = { width: 32, height: 'auto' as number | 'auto', blur: 18 } //TODO: replace `as` cast with proper typing

/** Shrink + blur a source image buffer into a tiny base64 WebP data URL. */
export const renderBlurDataUrl = async (src: Buffer, opts: BlurOptions = {}): Promise<string> => {
  const { width, height, blur } = { ...DEFAULTS, ...opts }
  const sharp = await loadSharp()
  const buf = await sharp(src, { failOn: 'none' })
    .rotate()
    .resize({ width, height: height === 'auto' ? undefined : height, withoutEnlargement: true })
    .blur(blur)
    .webp({ quality: 60 })
    .toBuffer()
  return `data:image/webp;base64,${buf.toString('base64')}`
}

/**
 * beforeChange on the source collection → populate `blurDataUrl` from the freshly
 * uploaded bytes (`req.file.data`). Runs only when a new file is present (create or
 * replace), so a metadata-only edit keeps the existing placeholder. Writing into the
 * returned `data` persists it in the same write — no follow-up update, no extra
 * revalidation.
 */
export const generateBlurDataUrl = (opts: BlurOptions = {}): CollectionBeforeChangeHook => {
  return async ({ data, req }) => {
    const file = req.file
    if (!file?.data) return data
    try {
      return { ...data, blurDataUrl: await renderBlurDataUrl(file.data, opts) }
    } catch (err) {
      req.payload.logger.warn(`[images] failed to generate blur placeholder: ${String(err)}`)
      return data
    }
  }
}

export interface BackfillBlurOptions extends BlurOptions {
  /** Source collection slug. Default `images`. */
  sourceSlug?: string
  /** Server origin for reading cloud/relative-URL uploads (else `NEXT_PUBLIC_SERVER_URL`). */
  baseUrl?: string
  /** Re-generate even for docs that already have a `blurDataUrl`. Default false. */
  force?: boolean
  /** Page size for the scan. Default 100. */
  batchSize?: number
}

/**
 * Backfill `blurDataUrl` for existing source docs (the migration equivalent of the
 * upstream plugin's script). Reads each upload's bytes the same dual local/remote way
 * the transform endpoint does, so it works whatever the storage adapter is. Returns
 * the number of docs updated; best-effort per doc (a failure is logged, not thrown).
 */
export const backfillBlurDataUrls = async (payload: Payload, opts: BackfillBlurOptions = {}): Promise<number> => {
  const { sourceSlug = 'images', force = false, batchSize = 100, baseUrl, ...blurOpts } = opts
  const slug = sourceSlug as Parameters<Payload['find']>[0]['collection'] //TODO: replace `as` cast with proper typing
  const origin = baseUrl ?? process.env.NEXT_PUBLIC_SERVER_URL ?? undefined
  const staticDir = resolveStaticDir(payload, sourceSlug)
  let page = 1
  let updated = 0
  for (;;) {
    const { docs, hasNextPage } = await payload.find({ collection: slug, limit: batchSize, page, depth: 0, overrideAccess: true })
    //TODO: replace `as` cast with proper typing
    for (const doc of docs as Array<UploadDocLike & { id: string | number; blurDataUrl?: string | null }>) {
      if (!force && doc.blurDataUrl) continue
      try {
        const bytes = await readBytes(doc, staticDir, origin)
        if (!bytes) continue
        await payload.update({
          collection: slug,
          id: doc.id,
          //TODO: replace `as` cast with proper typing
          data: { blurDataUrl: await renderBlurDataUrl(bytes, blurOpts) } as Record<string, unknown>,
          overrideAccess: true,
        })
        updated++
      } catch (err) {
        payload.logger.warn(`[images] backfill blur failed for ${sourceSlug}/${doc.id}: ${String(err)}`)
      }
    }
    if (!hasNextPage) break
    page++
  }
  return updated
}
