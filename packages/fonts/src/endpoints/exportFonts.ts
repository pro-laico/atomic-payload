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
  /** Slug of the Font upload collection. Default `font`. */
  fontCollectionSlug?: string
  /** Slug of the `@pro-laico/styles` design-set collection. Default `designSet`. */
  designSetSlug?: string
  /** Name of the `font` group field on the design set. Default `font`. */
  designSetFontField?: string
}

type FontDoc = { filename?: string | null; url?: string | null; mimeType?: string | null }
type FontSelection = Partial<Record<Role, FontDoc | string | null>>

/** A single exported font: its filename, extension, mime type, and base64-encoded bytes. */
export type ExportedFont = { filename: string; extension: string; mimeType: string | null; data: string }
/** JSON returned by the fonts export endpoint. */
export type ExportFontsResponse = { fonts: Partial<Record<Role, ExportedFont>> }

/**
 * Constant-time secret compare. Both sides are sha256-hashed to a fixed 32 bytes
 * first, so the comparison is constant-time regardless of length — a raw length
 * check would leak the secret's length through timing, and `timingSafeEqual`
 * throws on unequal-length buffers.
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
// URL Payload reports. Trying disk first avoids depending on whether `url` is
// relative or absolute, which varies with `serverURL`.
async function readFontBytes(doc: FontDoc, staticDir: string): Promise<Buffer | null> {
  if (doc.filename) {
    // Resolve under staticDir and confirm the result stays inside it — guards
    // against a `filename` carrying path-traversal segments (`../`) or an
    // absolute path that would escape the upload directory.
    const base = path.resolve(staticDir)
    const filePath = path.resolve(base, doc.filename)
    if ((filePath === base || filePath.startsWith(base + path.sep)) && fs.existsSync(filePath)) {
      return fs.readFileSync(filePath)
    }
  }
  if (typeof doc.url === 'string' && /^https?:\/\//i.test(doc.url)) {
    try {
      // Time-box the upstream fetch so a hanging storage URL can't stall the build.
      const res = await fetch(doc.url, { signal: AbortSignal.timeout(15_000) })
      if (res.ok) return Buffer.from(await res.arrayBuffer())
    } catch {
      // fall through to "not found"
    }
  }
  return null
}

/**
 * A `GET /api/fonts/export` endpoint registered by `fontsPlugin`. It resolves
 * the active fonts (the active design set's `font` group, else the standalone
 * `fontSet` global) and returns their bytes (base64) so the `generate:fonts`
 * script can write them to disk for `next/font/local` — no per-file storage
 * auth needed, because the endpoint reads them server-side.
 *
 * Secured by the project's `PAYLOAD_SECRET`: the caller sends it as
 * `Authorization: Bearer <secret>`, compared against `process.env.PAYLOAD_SECRET`.
 */
export const exportFontsEndpoint = (opts: ExportFontsEndpointOptions = {}): Endpoint => {
  const {
    path: endpointPath = '/fonts/export',
    fontSetGlobalSlug = 'fontSet',
    fontCollectionSlug = 'font',
    designSetSlug = 'designSet',
    designSetFontField = 'font',
  } = opts

  return {
    path: endpointPath,
    method: 'get',
    handler: async (req) => {
      const { payload } = req

      // Compare against the RAW PAYLOAD_SECRET (what the caller sends), not
      // `payload.secret` — Payload stores that as a sha256 hash of the secret.
      const secret = process.env.PAYLOAD_SECRET || ''
      const provided = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim()
      if (!secret || !provided || !secretsMatch(provided, secret)) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // Past the secret gate we read with `overrideAccess: true` deliberately —
      // the shared secret is the trust boundary, so there's no Payload user to
      // enforce collection access against.
      // Prefer the active design set's `font` group, then fall back to the
      // standalone `fontSet` global. Each lookup tolerates the collection /
      // global not existing in this project.
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

      const fonts: Partial<Record<Role, ExportedFont>> = {}
      if (selection) {
        const staticDir = resolveStaticDir(payload, fontCollectionSlug)
        for (const role of ROLES) {
          const doc = selection[role]
          if (!doc || typeof doc === 'string' || !doc.filename) continue
          const bytes = await readFontBytes(doc, staticDir)
          if (!bytes) continue
          fonts[role] = {
            filename: doc.filename,
            extension: doc.filename.split('.').pop()?.toLowerCase() || 'ttf',
            mimeType: doc.mimeType ?? null,
            data: bytes.toString('base64'),
          }
        }
      }

      // no-store: the response carries font bytes behind auth — keep any proxy
      // or CDN from caching it and serving it without the secret.
      return Response.json({ fonts } satisfies ExportFontsResponse, { headers: { 'Cache-Control': 'no-store' } })
    },
  }
}
