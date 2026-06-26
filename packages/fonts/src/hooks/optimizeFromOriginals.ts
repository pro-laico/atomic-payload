import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionSlug } from 'payload'

import { readUploadBytes } from '../lib/uploadBytes'
import { detectMetadata, resolveCharsetText, subsetToWoff2 } from './optimizeFont'

type Ref = string | number | { id?: string | number } | null | undefined
const refId = (r: Ref): string | number | undefined => (r && typeof r === 'object' ? r.id : (r ?? undefined)) ?? undefined

/**
 * Every `fontOriginal` id a typeface doc references across all of its slots. Each
 * original belongs to exactly one typeface — enforced by the create-only upload
 * slots (UI) and the `rejectSharedOriginals` guard (data layer) — so cleanup can
 * delete a de-referenced or deleted original outright, with no shared-original /
 * concurrent-delete hazard.
 */
export const originalIdsFromDoc = (data: Record<string, unknown>): Array<string | number> => {
  const ids: Array<string | number> = []
  const variable = (data.variable ?? {}) as { upright?: Ref; italic?: Ref }
  for (const r of [variable.upright, variable.italic]) {
    const id = refId(r)
    if (id != null) ids.push(id)
  }
  for (const row of (Array.isArray(data.weights) ? data.weights : []) as Array<{ file?: Ref }>) {
    const id = refId(row.file)
    if (id != null) ids.push(id)
  }
  return ids
}

/** A weight/style file the typeface should have an optimized WOFF2 for. */
interface Desired {
  originalId: string | number
  style: 'normal' | 'italic'
  isVariable: boolean
  /** Static rows carry an explicit weight; variable files derive a range from the binary. */
  weight?: string
}

/** Read the font doc's slots into the set of originals to optimize. */
const desiredFromDoc = (data: Record<string, unknown>): Desired[] => {
  const desired: Desired[] = []
  const variable = (data.variable ?? {}) as { upright?: Ref; italic?: Ref }
  const uprightId = refId(variable.upright)
  const italicId = refId(variable.italic)
  if (uprightId != null) desired.push({ originalId: uprightId, style: 'normal', isVariable: true })
  if (italicId != null) desired.push({ originalId: italicId, style: 'italic', isVariable: true })
  // Variable and weights are mutually exclusive (enforced on the collection); only
  // read the weights array when no variable file is present.
  if (uprightId == null && italicId == null) {
    const weights = Array.isArray(data.weights) ? data.weights : []
    for (const row of weights as Array<{ weight?: string; style?: string; file?: Ref }>) {
      const fid = refId(row.file)
      if (fid != null) desired.push({ originalId: fid, style: row.style === 'italic' ? 'italic' : 'normal', isVariable: false, weight: row.weight })
    }
  }
  return desired
}

export interface OptimizeFromOriginalsOptions {
  /** Characters to keep, or a preset name ('latin' | 'latin-ext'). Default 'latin'. */
  charset?: string
  /** Slug of the archival original collection. Default 'fontOriginal'. */
  originalSlug?: string
  /** Slug of the optimized (served) collection. Default 'fontOptimized'. */
  optimizedSlug?: string
}

/**
 * `afterChange` for the `Font` typeface: reconcile its served `fontOptimized`
 * files against the `fontOriginal` files referenced in its slots.
 *
 * Keyed by source-original id: a newly-referenced original is fetched, subsetted
 * to WOFF2 (variable weight range read from the `wght` axis; static weight/style
 * from the row) and created; an original that's gone has its optimized deleted;
 * an unchanged original is kept (only its weight/style metadata is synced if the
 * row changed). Best-effort — a single bad font logs a warning and is skipped,
 * never failing the typeface save. Touches only `fontOptimized`, so it can't
 * re-trigger this hook.
 */
export const optimizeFromOriginalsHook = (opts: OptimizeFromOriginalsOptions = {}): CollectionAfterChangeHook => {
  const charsetText = resolveCharsetText(opts.charset)
  const originalSlug = (opts.originalSlug || 'fontOriginal') as CollectionSlug
  const optimizedSlug = (opts.optimizedSlug || 'fontOptimized') as CollectionSlug

  return async ({ doc, operation, previousDoc, req }) => {
    const data = doc as Record<string, unknown>
    const fontId = data.id as string | number
    const desired = desiredFromDoc(data)

    // Forward the request's auth so reading the original succeeds when it lives on
    // cloud storage served through Payload's own access-controlled file route — an
    // unauthenticated fetch 403s. `origin`/`referer` are required too: Payload's CSRF
    // protection rejects a cookie-authenticated request whose Origin isn't allow-listed.
    const fwdHeaders: Record<string, string> = {}
    for (const h of ['cookie', 'authorization', 'origin', 'referer']) {
      const v = req.headers?.get(h)
      if (v) fwdHeaders[h] = v
    }

    try {
      const existing = await req.payload.find({
        collection: optimizedSlug,
        where: { font: { equals: fontId } },
        depth: 0,
        limit: 1000,
        overrideAccess: true,
        req,
      })
      const byOriginal = new Map<string | number, Record<string, unknown>>()
      for (const d of existing.docs as unknown as Array<Record<string, unknown>>) {
        const oid = refId(d.original as Ref)
        if (oid != null) byOriginal.set(oid, d)
      }
      const desiredIds = new Set(desired.map((d) => d.originalId))

      // Create new, or sync metadata on a kept one whose row changed.
      for (const d of desired) {
        const current = byOriginal.get(d.originalId)
        if (current) {
          const weightDrift = !d.isVariable && d.weight && String(current.weight ?? '') !== d.weight
          if (weightDrift || String(current.style ?? '') !== d.style) {
            await req.payload.update({
              collection: optimizedSlug,
              id: current.id as string | number,
              data: { weight: d.weight ?? current.weight, style: d.style } as never,
              overrideAccess: true,
              req,
            })
          }
          continue
        }
        try {
          const original = (await req.payload.findByID({ collection: originalSlug, id: d.originalId, depth: 0, overrideAccess: true, req })) as {
            filename?: string | null
            url?: string | null
          }
          const bytes = await readUploadBytes(req.payload, originalSlug, original, { headers: fwdHeaders })
          if (!bytes) {
            req.payload.logger.warn(`Font optimize: could not read original ${d.originalId}`)
            continue
          }
          const meta = await detectMetadata(bytes)
          const woff2 = await subsetToWoff2(bytes, charsetText)
          // Variable: the intrinsic axis range wins. Static: the row's weight wins, detection fills a blank.
          const weight = d.isVariable ? (meta?.weight ?? d.weight) : (d.weight ?? meta?.weight)
          const baseName = (original.filename || `font-${d.originalId}`).replace(/\.[^.]+$/, '')
          // Shallow-cloned req: createLocalReq mutates `.file` on the req it's given;
          // the clone keeps that off the parent while sharing the transaction.
          await req.payload.create({
            collection: optimizedSlug,
            req: { ...req },
            overrideAccess: true,
            data: { font: fontId, original: d.originalId, weight, style: d.style, isVariable: meta?.isVariable ?? d.isVariable } as never,
            file: { data: woff2, name: `${baseName}.woff2`, mimetype: 'font/woff2', size: woff2.length },
          })
        } catch (err) {
          req.payload.logger.warn({ msg: `Font optimization failed for original ${d.originalId}`, err })
        }
      }

      // Delete optimized files whose source original is no longer referenced.
      for (const [oid, d] of byOriginal) {
        if (desiredIds.has(oid)) continue
        try {
          await req.payload.delete({ collection: optimizedSlug, id: d.id as string | number, overrideAccess: true, req })
        } catch (err) {
          req.payload.logger.warn({ msg: 'Could not delete stale optimized font', err })
        }
      }

      // Delete originals this update de-referenced (a swapped/removed slot file).
      // Originals aren't shared (create-only slots), so this is always safe.
      if (operation === 'update' && previousDoc) {
        const stillReferenced = new Set(originalIdsFromDoc(data))
        for (const oid of originalIdsFromDoc(previousDoc as Record<string, unknown>)) {
          if (stillReferenced.has(oid)) continue
          try {
            await req.payload.delete({ collection: originalSlug, id: oid, overrideAccess: true, req })
          } catch (err) {
            req.payload.logger.warn({ msg: `Could not delete de-referenced font original ${oid}`, err })
          }
        }
      }
    } catch (err) {
      req.payload.logger.warn({ msg: 'Font optimize reconcile failed', err })
    }
    return doc
  }
}

/**
 * `afterDelete` for the `Font` typeface: cascade-delete its served `fontOptimized`
 * files (by `font`) and the `fontOriginal` files its slots referenced, so nothing
 * orphans in storage. Best-effort.
 */
export const cleanupFontAssetsHook = (opts: { originalSlug?: string; optimizedSlug?: string } = {}): CollectionAfterDeleteHook => {
  const originalSlug = (opts.originalSlug || 'fontOriginal') as CollectionSlug
  const optimizedSlug = (opts.optimizedSlug || 'fontOptimized') as CollectionSlug

  return async ({ doc, req }) => {
    const data = doc as Record<string, unknown>

    try {
      await req.payload.delete({ collection: optimizedSlug, where: { font: { equals: data.id } }, overrideAccess: true, req })
    } catch (err) {
      req.payload.logger.warn({ msg: 'Could not delete optimized fonts', err })
    }
    // Delete the originals this typeface referenced (create-only slots → never shared).
    for (const id of originalIdsFromDoc(data)) {
      try {
        await req.payload.delete({ collection: originalSlug, id, overrideAccess: true, req })
      } catch (err) {
        req.payload.logger.warn({ msg: 'Could not delete font original', err })
      }
    }
    return doc
  }
}
