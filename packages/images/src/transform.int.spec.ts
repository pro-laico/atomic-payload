import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import type { Endpoint, Payload, PayloadRequest } from 'payload'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { bootPayload, teardown } from '@tools/test-helpers'

import { imagesPlugin } from './plugin'
import { resolveStaticDir } from './transform/source'

const tmp = (p: string) => mkdtempSync(join(tmpdir(), p))

const makeReq = (payload: Payload, id: string, query: string, accept?: string, headers: Record<string, string> = {}): PayloadRequest =>
  ({
    payload,
    routeParams: { id },
    searchParams: new URLSearchParams(query),
    headers: new Headers({ ...(accept ? { accept } : {}), ...headers }),
  }) as unknown as PayloadRequest

const getHandler = (payload: Payload, method: string, path: string) => {
  const ep = (payload.config.endpoints ?? []).find((e: Endpoint) => e.method === method && e.path === path)
  if (!ep) throw new Error(`endpoint ${method} ${path} not registered`)
  return ep.handler
}

const countVariants = async (payload: Payload, sourceId: string | number): Promise<number> => {
  const r = await payload.find({ collection: 'generatedImages', where: { source: { equals: sourceId } }, limit: 100, overrideAccess: true })
  return r.totalDocs
}

const waitForVariants = async (payload: Payload, sourceId: string | number, min = 1, tries = 30): Promise<number> => {
  for (let i = 0; i < tries; i++) {
    const n = await countVariants(payload, sourceId)
    if (n >= min) return n
    await new Promise((res) => setTimeout(res, 50))
  }
  return countVariants(payload, sourceId)
}

describe('transform endpoint (integration)', () => {
  let payload: Payload
  let sourceId: string

  beforeAll(async () => {
    payload = await bootPayload([
      imagesPlugin({
        imagesOptions: { upload: { staticDir: tmp('imgtest-src-') } },
        generatedImagesOptions: { upload: { staticDir: tmp('imgtest-var-') } },
      }),
    ])
    const png = await sharp({ create: { width: 1200, height: 800, channels: 3, background: { r: 20, g: 140, b: 90 } } })
      .png()
      .toBuffer()
    const doc = await payload.create({
      collection: 'images',
      data: { alt: 'green', focalX: 40, focalY: 60 },
      file: { data: png, mimetype: 'image/png', name: 'green.png', size: png.byteLength },
      overrideAccess: true,
    })
    sourceId = String(doc.id)
  }, 60_000)

  afterAll(async () => {
    await teardown(payload)
  })

  it('registers the transform + purge endpoints at config level', () => {
    const paths = (payload.config.endpoints ?? []).map((e) => `${e.method} ${e.path}`)
    expect(paths).toContain('get /img/:id')
    expect(paths).toContain('post /img/purge/:id')
  })

  it('400s without a dimension and 404s for an unknown source', async () => {
    const handler = getHandler(payload, 'get', '/img/:id')
    expect((await handler(makeReq(payload, sourceId, ''))).status).toBe(400)
    expect((await handler(makeReq(payload, 'does-not-exist', 'w=320'))).status).toBe(404)
  })

  it('generates a variant on miss (streams bytes + caches a doc) and serves it on hit', async () => {
    const handler = getHandler(payload, 'get', '/img/:id')

    const miss = await handler(makeReq(payload, sourceId, 'w=600&h=600&fit=cover&fmt=webp'))
    expect(miss.status).toBe(200)
    expect(miss.headers.get('Content-Type')).toBe('image/webp')
    // Default images collection is publicly readable → public + edge-cacheable.
    expect(miss.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable')
    expect(miss.headers.get('CDN-Cache-Control')).toBe('public, max-age=31536000, immutable')
    const bytes = Buffer.from(await miss.arrayBuffer())
    const meta = await sharp(bytes).metadata()
    expect(meta.format).toBe('webp')
    expect(meta.width).toBe(600)
    expect(meta.height).toBe(600)

    // The variant is persisted after the response (fire-and-forget in tests).
    expect(await waitForVariants(payload, sourceId, 1)).toBe(1)

    // A second identical request is a cache hit — no new variant created.
    const hit = await handler(makeReq(payload, sourceId, 'w=600&h=600&fit=cover&fmt=webp'))
    expect(hit.status).toBe(200)
    const hitBytes = Buffer.from(await hit.arrayBuffer())
    expect((await sharp(hitBytes).metadata()).width).toBe(600)
    await new Promise((res) => setTimeout(res, 150))
    expect(await countVariants(payload, sourceId)).toBe(1)
  })

  it('negotiates fmt=auto via the Accept header and sets Vary', async () => {
    const handler = getHandler(payload, 'get', '/img/:id')
    const res = await handler(makeReq(payload, sourceId, 'w=320&h=320&fmt=auto', 'image/avif,image/webp,*/*'))
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('image/avif')
    expect(res.headers.get('Vary')).toBe('Accept')
  })

  it('honors the requested width exactly (no server-side snapping)', async () => {
    const handler = getHandler(payload, 'get', '/img/:id')
    const res = await handler(makeReq(payload, sourceId, 'w=730&fmt=jpeg'))
    expect(res.status).toBe(200)
    const meta = await sharp(Buffer.from(await res.arrayBuffer())).metadata()
    expect(meta.width).toBe(730) // exact — the srcset's pixelStep is what bounds variants
  })

  it('returns 304 when If-None-Match matches the variant ETag', async () => {
    const handler = getHandler(payload, 'get', '/img/:id')
    const first = await handler(makeReq(payload, sourceId, 'w=200&h=200&fmt=jpeg'))
    expect(first.status).toBe(200)
    const etag = first.headers.get('ETag')
    expect(etag).toBeTruthy()
    const second = await handler(makeReq(payload, sourceId, 'w=200&h=200&fmt=jpeg', undefined, { 'if-none-match': etag as string }))
    expect(second.status).toBe(304)
    expect(second.headers.get('ETag')).toBe(etag)
  })

  it('502s when the source bytes are unreadable', async () => {
    const png = await sharp({ create: { width: 100, height: 100, channels: 3, background: { r: 1, g: 2, b: 3 } } })
      .png()
      .toBuffer()
    const doc = await payload.create({
      collection: 'images',
      data: { alt: 'gone' },
      file: { data: png, mimetype: 'image/png', name: 'gone.png', size: png.byteLength },
      overrideAccess: true,
    })
    // Remove the stored original out from under the endpoint.
    const fresh = await payload.findByID({ collection: 'images', id: doc.id, overrideAccess: true })
    rmSync(join(resolveStaticDir(payload, 'images'), fresh.filename as string), { force: true })

    const handler = getHandler(payload, 'get', '/img/:id')
    const res = await handler(makeReq(payload, String(doc.id), 'w=100&h=100&fmt=jpeg'))
    expect(res.status).toBe(502)
  })
})
