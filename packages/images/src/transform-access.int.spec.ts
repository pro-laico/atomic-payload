import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import type { Endpoint, Payload, PayloadRequest } from 'payload'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { bootPayload, teardown } from '@tools/test-helpers'

import { imagesPlugin } from './plugin'

const tmp = (p: string) => mkdtempSync(join(tmpdir(), p))

const makeReq = (payload: Payload, id: string, query: string, user?: unknown, method = 'get'): PayloadRequest =>
  ({
    payload,
    user,
    routeParams: { id },
    method,
    searchParams: new URLSearchParams(query),
    headers: new Headers(),
  }) as unknown as PayloadRequest

const getHandler = (payload: Payload, method: string, path: string) => {
  const ep = (payload.config.endpoints ?? []).find((e: Endpoint) => e.method === method && e.path === path)
  if (!ep) throw new Error(`endpoint ${method} ${path} not registered`)
  return ep.handler
}

// A source with ROW-LEVEL read access: logged-in users can read every image except
// those alt'd `hidden` (anonymous users read nothing). Proves the transform + purge
// endpoints (a) don't serve/touch restricted images for unauthorized requesters,
// (b) mark an authorized user's variant `private` (no shared/CDN replay), and (c)
// gate purge on the caller's read access to the source.
describe('transform endpoint — access-controlled source (integration)', () => {
  let payload: Payload
  let visibleId: string
  let hiddenId: string
  const user = { id: 'u1' }

  beforeAll(async () => {
    payload = await bootPayload([
      imagesPlugin({
        imagesOptions: {
          access: { read: ({ req }) => (req.user ? { alt: { not_equals: 'hidden' } } : false) },
          upload: { staticDir: tmp('imgauth-src-') },
        },
        generatedImagesOptions: { upload: { staticDir: tmp('imgauth-var-') } },
      }),
    ])
    const png = async (name: string) =>
      sharp({ create: { width: 800, height: 600, channels: 3, background: { r: 90, g: 90, b: 200 } } })
        .png()
        .toBuffer()
        .then((data) => ({ data, mimetype: 'image/png', name, size: data.byteLength }))
    const visible = await payload.create({ collection: 'images', data: { alt: 'visible' }, file: await png('visible.png'), overrideAccess: true })
    const hidden = await payload.create({ collection: 'images', data: { alt: 'hidden' }, file: await png('hidden.png'), overrideAccess: true })
    visibleId = String(visible.id)
    hiddenId = String(hidden.id)
  }, 60_000)

  afterAll(async () => {
    // Let any fire-and-forget variant persist settle before tearing down the DB
    // (otherwise it races teardown and logs a spurious adapter error).
    await new Promise((r) => setTimeout(r, 150))
    await teardown(payload)
  })

  it('404s an anonymous request for a restricted source (no existence leak)', async () => {
    const handler = getHandler(payload, 'get', '/img/:id')
    const res = await handler(makeReq(payload, visibleId, 'w=200&fmt=jpeg'))
    expect(res.status).toBe(404)
  })

  it('serves an authorized request but marks the variant private (never shared-cacheable)', async () => {
    const handler = getHandler(payload, 'get', '/img/:id')
    const res = await handler(makeReq(payload, visibleId, 'w=200&fmt=jpeg', user))
    expect(res.status).toBe(200)
    // private → only the requester's own browser may cache it; no edge/CDN headers.
    expect(res.headers.get('Cache-Control')).toBe('private, max-age=31536000, immutable')
    expect(res.headers.get('CDN-Cache-Control')).toBeNull()
    expect(res.headers.get('Vercel-CDN-Cache-Control')).toBeNull()
  })

  it('404s an authorized request for a row-level-hidden source', async () => {
    const handler = getHandler(payload, 'get', '/img/:id')
    const res = await handler(makeReq(payload, hiddenId, 'w=200&fmt=jpeg', user))
    expect(res.status).toBe(404)
  })

  it('purge: 401 anonymous, 200 for a readable source, 404 for one the user cannot read', async () => {
    const handler = getHandler(payload, 'post', '/img/purge/:id')

    const unauthed = await handler(makeReq(payload, visibleId, '', undefined, 'post'))
    expect(unauthed.status).toBe(401)

    const ok = await handler(makeReq(payload, visibleId, '', user, 'post'))
    expect(ok.status).toBe(200)

    // The user can't READ the `hidden` source, so they can't purge its variants.
    const denied = await handler(makeReq(payload, hiddenId, '', user, 'post'))
    expect(denied.status).toBe(404)
  })
})
