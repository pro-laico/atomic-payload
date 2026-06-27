/**
 * Read the raw bytes of an upload doc from either local disk (the collection's
 * `staticDir`) or cloud storage (Vercel Blob, S3, …) by fetching the absolute URL
 * Payload reports. Mirrors the dual read used by `@pro-laico/fonts`' export
 * endpoint, including the path-traversal guard, a bounded fetch timeout, and an
 * SSRF guard on the remote-fetch path.
 */
import fs from 'node:fs'
import path from 'node:path'
import type { Payload } from 'payload'

export interface UploadDocLike {
  filename?: string | null
  url?: string | null
}

const MAX_FETCH_BYTES = 64 * 1024 * 1024

/** True for hostnames in loopback / private / link-local space (the SSRF sinks). */
const isPrivateHost = (hostname: string): boolean => {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (h === 'localhost' || h.endsWith('.localhost') || h === '0.0.0.0' || h === '::1') return true
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (m) {
    const a = Number(m[1])
    const b = Number(m[2])
    if (a === 0 || a === 10 || a === 127) return true
    if (a === 169 && b === 254) return true
    if (a === 192 && b === 168) return true
    if (a === 172 && b >= 16 && b <= 31) return true
    if (a === 100 && b >= 64 && b <= 127) return true
    return false
  }
  return /^fe80:/i.test(h) || /^f[cd][0-9a-f]{2}:/i.test(h)
}

/**
 * SSRF guard for the remote-source fetch: always allow the configured server origin
 * itself (so self-fetching Payload's own static route works, even on localhost in
 * dev), but otherwise refuse private/loopback/link-local hosts — blocking cloud
 * metadata endpoints and internal services reachable from a malicious `url`.
 */
export const isAllowedFetchTarget = (target: URL, trusted: URL | null): boolean => {
  if (trusted && target.host === trusted.host) return true
  return !isPrivateHost(target.hostname)
}

/** Resolve a collection's on-disk upload directory (absolute). */
export const resolveStaticDir = (payload: Payload, slug: string): string => {
  const collections = payload.collections as Record<string, { config?: { upload?: { staticDir?: string } } }> //TODO: replace `as` cast with proper typing
  const dir = collections?.[slug]?.config?.upload?.staticDir
  const base = dir?.length ? dir : slug
  return path.isAbsolute(base) ? base : path.resolve(process.cwd(), base)
}

/**
 * Read an upload's bytes. In order:
 *  1. the local file under `staticDir` (verifying the resolved path stays inside it),
 *  2. the absolute URL the doc reports (cloud storage), or
 *  3. its relative URL resolved against `baseUrl` — i.e. self-fetch Payload's own
 *     static file route, which serves the file whatever the adapter/storage is.
 *
 * Step 3 is why a configured storage adapter (whose `url` is relative, or served by
 * Payload) no longer yields an unreadable source. Returns null when nothing yields
 * bytes.
 */
export const readBytes = async (doc: UploadDocLike, staticDir: string, baseUrl?: string): Promise<Buffer | null> => {
  if (doc.filename) {
    const base = path.resolve(staticDir)
    const filePath = path.resolve(base, doc.filename)
    if ((filePath === base || filePath.startsWith(base + path.sep)) && fs.existsSync(filePath)) return fs.readFileSync(filePath)
  }

  if (typeof doc.url === 'string' && doc.url) {
    const isAbsolute = /^https?:\/\//i.test(doc.url)
    const base = (baseUrl ?? '').replace(/\/$/, '')
    const targetStr = isAbsolute ? doc.url : base ? `${base}${doc.url.startsWith('/') ? '' : '/'}${doc.url}` : ''
    if (/^https?:\/\//i.test(targetStr)) {
      let target: URL
      let trusted: URL | null = null
      try {
        target = new URL(targetStr)
      } catch {
        return null
      }
      try {
        trusted = base ? new URL(base) : null
      } catch {}
      if (!isAllowedFetchTarget(target, trusted)) return null
      try {
        const res = await fetch(targetStr, { signal: AbortSignal.timeout(15_000), redirect: 'manual' })
        if (!res.ok) return null
        const declared = Number(res.headers?.get?.('content-length') ?? '')
        if (Number.isFinite(declared) && declared > MAX_FETCH_BYTES) return null
        const buf = Buffer.from(await res.arrayBuffer())
        return buf.byteLength > MAX_FETCH_BYTES ? null : buf
      } catch {}
    }
  }
  return null
}
