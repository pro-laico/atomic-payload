import fs from 'node:fs'
import path from 'node:path'
import { createHash, timingSafeEqual } from 'node:crypto'

import type { CollectionSlug, Endpoint, GlobalSlug, Payload } from 'payload'

type Role = 'sans' | 'serif' | 'mono' | 'display'
const ROLES: Role[] = ['sans', 'serif', 'mono', 'display']

export interface ExportFontsEndpointOptions {
  /** Mount path under the Payload API route. Default `/fonts/export` (→ `/api/fonts/export`). */
  path?: string
  /** Slug of the standalone font-selection global. Default `fontSet`. */
  fontSetGlobalSlug?: string
  /** Slug of the `Font` typeface collection. Default `font`. */
  fontCollectionSlug?: string
  /** Slug of the optimized weight-file upload collection. Default `fontFile`. */
  fontFileCollectionSlug?: string
  /** Slug of the `@pro-laico/styles` design-set collection. Default `designSet`. */
  designSetSlug?: string
  /** Name of the `font` group field on the design set. Default `font`. */
  designSetFontField?: string
}

/** The readable shape of a `fontFile` (a typeface's weight file). */
type FontFileDoc = { filename?: string | null; url?: string | null; mimeType?: string | null; weight?: string | null; style?: string | null }
/** The selected typeface for a role: a populated `font` doc (with `files`) or its id. */
type TypefaceRef = { id?: string | number; files?: unknown[] } | string | number | null
type FontSelection = Partial<Record<Role, TypefaceRef | TypefaceRef[]>>

/** A single exported weight file: filename, extension, mime, base64 bytes, and (optional) weight/style. */
export type ExportedFont = {
  filename: string
  extension: string
  mimeType: string | null
  data: string
  weight?: string | null
  style?: string | null
}
/** JSON returned by the fonts export endpoint — an array of weight files per role. */
export type ExportFontsResponse = { fonts: Partial<Record<Role, ExportedFont[]>> }

/**
 * Constant-time secret compare. Both sides are sha256-hashed to a fixed 32 bytes
 * first, so the comparison is constant-time regardless of length.
 */
function secretsMatch(provided: string, secret: string): boolean {
  const a = createHash('sha256').update(provided).digest()
  const b = createHash('sha256').update(secret).digest()
  return timingSafeEqual(a, b)
}

function resolveStaticDir(payload: Payload, slug: string): string {
  const collections = payload.collections as Record<string, { config?: { upload?: { staticDir?: string } } }>
  const dir = collections?.[slug]?.config?.upload?.staticDir
  const base = dir?.length ? dir : slug
  return path.isAbsolute(base) ? base : path.resolve(process.cwd(), base)
}

// Local storage keeps the file on disk under the collection's staticDir; cloud
// storage (Vercel Blob, S3, …) does not, so fall back to fetching the absolute
// URL Payload reports.
async function readFontBytes(doc: FontFileDoc, staticDir: string): Promise<Buffer | null> {
  if (doc.filename) {
    // Resolve under staticDir and confirm the result stays inside it — guards
    // against path-traversal segments or an absolute path escaping the dir.
    const base = path.resolve(staticDir)
    const filePath = path.resolve(base, doc.filename)
    if ((filePath === base || filePath.startsWith(base + path.sep)) && fs.existsSync(filePath)) {
      return fs.readFileSync(filePath)
    }
  }
  if (typeof doc.url === 'string' && /^https?:\/\//i.test(doc.url)) {
    try {
      const res = await fetch(doc.url, { signal: AbortSignal.timeout(15_000) })
      if (res.ok) return Buffer.from(await res.arrayBuffer())
    } catch {
      // fall through to "not found"
    }
  }
  return null
}

/**
 * `GET /api/fonts/export`. Resolves the active fonts (the active design set's
 * `font` group, else the standalone `fontSet` global) — each role points at ONE
 * `font` typeface — and returns the bytes of that typeface's weight files
 * (`fontFile`s) so the `generate:fonts` script can write them for
 * `next/font/local`. Secured by the project's `PAYLOAD_SECRET` (Bearer).
 */
export const exportFontsEndpoint = (opts: ExportFontsEndpointOptions = {}): Endpoint => {
  const {
    path: endpointPath = '/fonts/export',
    fontSetGlobalSlug = 'fontSet',
    fontCollectionSlug = 'font',
    fontFileCollectionSlug = 'fontFile',
    designSetSlug = 'designSet',
    designSetFontField = 'font',
  } = opts

  return {
    path: endpointPath,
    method: 'get',
    handler: async (req) => {
      const { payload } = req

      // Compare against the RAW PAYLOAD_SECRET (what the caller sends).
      const secret = process.env.PAYLOAD_SECRET || ''
      const provided = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim()
      if (!secret || !provided || !secretsMatch(provided, secret)) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // Prefer the active design set's `font` group, then the standalone `fontSet`
      // global. The shared secret is the trust boundary → `overrideAccess: true`.
      let selection: FontSelection | undefined
      try {
        const designSet = await payload.find({
          collection: designSetSlug as CollectionSlug,
          where: { active: { equals: true } },
          limit: 1,
          depth: 1,
          overrideAccess: true,
        })
        if (designSet.docs.length) selection = (designSet.docs[0] as unknown as Record<string, unknown>)[designSetFontField] as FontSelection
      } catch {
        // no design-set collection in this project
      }
      if (!selection) {
        try {
          const fontSetGlobal = (await payload.findGlobal({ slug: fontSetGlobalSlug as GlobalSlug, depth: 1, overrideAccess: true })) as FontSelection
          selection = { sans: fontSetGlobal?.sans, serif: fontSetGlobal?.serif, mono: fontSetGlobal?.mono, display: fontSetGlobal?.display }
        } catch {
          // no fontSet global either
        }
      }

      const fonts: Partial<Record<Role, ExportedFont[]>> = {}
      if (selection) {
        // Bytes live on the fontFile collection, not the (non-upload) typeface.
        const staticDir = resolveStaticDir(payload, fontFileCollectionSlug)
        for (const role of ROLES) {
          const ref = selection[role]
          // One typeface per role (tolerate a stray array — take the first).
          const single = Array.isArray(ref) ? ref[0] : ref
          const typefaceId = single && typeof single === 'object' ? single.id : single
          if (typefaceId == null) continue

          // Re-fetch the typeface at depth 1 to populate `files` → fontFile docs
          // (a single designSet/global find won't deep-populate the nested relationship).
          let typeface: { files?: unknown[] } | null = null
          try {
            typeface = (await payload.findByID({
              collection: fontCollectionSlug as CollectionSlug,
              id: typefaceId,
              depth: 1,
              overrideAccess: true,
            })) as { files?: unknown[] }
          } catch {
            continue
          }
          const fileDocs = (Array.isArray(typeface?.files) ? typeface.files : []).filter(
            (d): d is FontFileDoc => Boolean(d) && typeof d === 'object' && Boolean((d as FontFileDoc).filename),
          )

          const exported: ExportedFont[] = []
          for (const doc of fileDocs) {
            const bytes = await readFontBytes(doc, staticDir)
            if (!bytes) continue
            exported.push({
              filename: doc.filename as string,
              extension: (doc.filename as string).split('.').pop()?.toLowerCase() || 'woff2',
              mimeType: doc.mimeType ?? null,
              data: bytes.toString('base64'),
              weight: doc.weight ?? null,
              style: doc.style ?? null,
            })
          }
          if (exported.length) fonts[role] = exported
        }
      }

      // no-store: the response carries font bytes behind auth.
      return Response.json({ fonts } satisfies ExportFontsResponse, { headers: { 'Cache-Control': 'no-store' } })
    },
  }
}
