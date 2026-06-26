import fs from 'node:fs'
import path from 'node:path'

import type { Payload } from 'payload'

/** The readable slice of any upload doc: a local filename and/or an absolute URL. */
export type UploadDoc = { filename?: string | null; url?: string | null }

/** Resolve a collection's on-disk `staticDir` (absolute), defaulting to its slug. */
const resolveStaticDir = (payload: Payload, slug: string): string => {
  const collections = payload.collections as Record<string, { config?: { upload?: { staticDir?: string } } }>
  const dir = collections?.[slug]?.config?.upload?.staticDir
  const base = dir?.length ? dir : slug
  return path.isAbsolute(base) ? base : path.resolve(process.cwd(), base)
}

/**
 * Read an upload document's bytes regardless of storage adapter: local disk keeps
 * the file under the collection's `staticDir`; cloud storage (Vercel Blob, S3, …)
 * does not, so fall back to fetching the URL Payload reports. Returns `null` when
 * neither yields the bytes.
 *
 * `opts.headers` are forwarded to the URL fetch — needed when the upload's URL is
 * Payload's own access-controlled file route (the common cloud-storage case): a
 * caller running inside an authenticated request passes its `cookie` so the route
 * authorizes the read instead of returning 403.
 */
export async function readUploadBytes(
  payload: Payload,
  slug: string,
  doc: UploadDoc,
  opts: { headers?: Record<string, string> } = {},
): Promise<Buffer | null> {
  if (doc.filename) {
    // Resolve under staticDir and confirm the result stays inside it — guards
    // against path-traversal segments or an absolute path escaping the dir.
    const base = path.resolve(resolveStaticDir(payload, slug))
    const filePath = path.resolve(base, doc.filename)
    if ((filePath === base || filePath.startsWith(base + path.sep)) && fs.existsSync(filePath)) {
      return fs.readFileSync(filePath)
    }
  }
  if (typeof doc.url === 'string' && /^https?:\/\//i.test(doc.url)) {
    try {
      const res = await fetch(doc.url, { headers: opts.headers, signal: AbortSignal.timeout(15_000) })
      if (res.ok) return Buffer.from(await res.arrayBuffer())
    } catch {
      // fall through to "not found"
    }
  }
  return null
}
