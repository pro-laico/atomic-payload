import { APIError, type CollectionAfterChangeHook, type CollectionBeforeChangeHook } from 'payload'

/**
 * One staged weight file the uploader sends with the typeface save (base64).
 * `mimetype` is intentionally NOT read server-side — the mime is re-derived from
 * the filename so a crafted request can't slip arbitrary content past the
 * `fontFile` mime allowlist by simply claiming `font/woff2`.
 */
type PendingFile = { data?: string; name?: string; mimetype?: string; weight?: string; style?: string }

/** Server-derived font mime from the filename extension (client mime is untrusted). */
const EXT_TO_MIME: Record<string, string> = { ttf: 'font/ttf', otf: 'font/otf', woff: 'font/woff', woff2: 'font/woff2' }
const fontMimeFromName = (name: string): string | undefined => EXT_TO_MIME[name.split('.').pop()?.toLowerCase() ?? '']

const refId = (f: unknown): string | number | undefined => (f && typeof f === 'object' ? (f as { id?: string | number }).id : (f as string | number))
const toIds = (v: unknown): Array<string | number> => (Array.isArray(v) ? v.map(refId).filter((id): id is string | number => id != null) : [])

/**
 * `beforeChange` for the `Font` (typeface) collection — the create-on-save step.
 *
 * The uploader doesn't upload on drop (which would orphan files if the document
 * is never saved); it STAGES files in the hidden `pendingUploads` field as base64.
 * Here, as part of the typeface's save transaction, each staged file is turned
 * into an optimized `fontFile` document (whose own hook subsets it to WOFF2 and
 * archives the original) and its id is appended to `files`. The base64 is then
 * cleared so it never persists. Because this runs inside the save's transaction,
 * an abandoned create writes nothing and a failed save rolls the new files back —
 * no orphans either way. Also enforces "at least one file".
 */
export const processPendingFontFiles = ({ fontFileSlug = 'fontFile' }: { fontFileSlug?: string } = {}): CollectionBeforeChangeHook => {
  return async ({ data, req }) => {
    const pending = Array.isArray((data as { pendingUploads?: unknown })?.pendingUploads)
      ? (data as { pendingUploads: PendingFile[] }).pendingUploads
      : []
    const existingIds = toIds((data as { files?: unknown })?.files)

    if (pending.length > 0) {
      const createdIds: Array<string | number> = []
      for (const p of pending) {
        if (!p?.data) continue
        const name = p.name || 'font'
        // Re-derive the mime from the filename rather than trusting the client's
        // `mimetype`; reject anything that isn't a recognized font extension so a
        // staged payload can't smuggle non-font bytes past the upload allowlist.
        const mimetype = fontMimeFromName(name)
        if (!mimetype) {
          throw new APIError(`"${name}" isn't a supported font file — use .ttf, .otf, .woff, or .woff2.`, 400, null, true)
        }
        const buffer = Buffer.from(p.data, 'base64')
        // Shared-cloned req so the nested upload joins this save's transaction
        // (rolls back with it) without clobbering the parent req.
        const created = await req.payload.create({
          collection: fontFileSlug as never,
          req: { ...req },
          overrideAccess: true,
          data: { weight: p.weight, style: p.style } as never,
          file: { data: buffer, name, mimetype, size: buffer.length },
        })
        createdIds.push((created as { id: string | number }).id)
      }
      ;(data as { files?: unknown }).files = [...existingIds, ...createdIds]
    }
    // Never persist the base64 payload.
    ;(data as { pendingUploads?: unknown }).pendingUploads = []

    const finalIds = toIds((data as { files?: unknown })?.files)
    if (finalIds.length === 0) {
      throw new APIError('Add at least one font file before saving.', 400, null, true)
    }
    return data
  }
}

/**
 * `afterChange` for `Font`: on update, delete the `fontFile`s that were removed
 * from `files` (each cascades to its archived original). Deletion is deferred to
 * the save — removing a weight in the uploader only de-references it — so
 * abandoning an edit leaves the file intact, and a saved removal is cleaned up.
 */
export const deleteDereferencedFontFiles = ({ fontFileSlug = 'fontFile' }: { fontFileSlug?: string } = {}): CollectionAfterChangeHook => {
  return async ({ doc, previousDoc, operation, req }) => {
    if (operation !== 'update') return doc
    const newIds = new Set(toIds((doc as { files?: unknown })?.files))
    for (const id of toIds((previousDoc as { files?: unknown })?.files)) {
      if (newIds.has(id)) continue
      try {
        await req.payload.delete({ collection: fontFileSlug as never, id, req, overrideAccess: true })
      } catch (err) {
        req.payload.logger.warn({ msg: 'Could not delete de-referenced font file', err })
      }
    }
    return doc
  }
}
