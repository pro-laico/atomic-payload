import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import type { Endpoint, Payload, PayloadRequest } from 'payload'
import sharp from 'sharp'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { bootPayload, teardown } from '@tools/test-helpers'

import { imagesPlugin } from './plugin'

const tmp = (p: string) => mkdtempSync(join(tmpdir(), p))

const countVariants = async (payload: Payload, sourceId: string | number): Promise<number> => {
  const r = await payload.find({ collection: 'generatedImages', where: { source: { equals: sourceId } }, limit: 100, overrideAccess: true })
  return r.totalDocs
}

describe('variant purge (integration)', () => {
  let payload: Payload
  let pngSource: Buffer
  let webpVariant: Buffer

  beforeAll(async () => {
    payload = await bootPayload([
      imagesPlugin({
        imagesOptions: { upload: { staticDir: tmp('imgpurge-src-') } },
        generatedImagesOptions: { upload: { staticDir: tmp('imgpurge-var-') } },
      }),
    ])
    pngSource = await sharp({ create: { width: 400, height: 400, channels: 3, background: { r: 200, g: 30, b: 30 } } })
      .png()
      .toBuffer()
    webpVariant = await sharp(pngSource).webp().toBuffer()
  }, 60_000)

  afterAll(async () => {
    await teardown(payload)
  })

  const createSource = async (data: Record<string, unknown> = {}): Promise<string | number> => {
    const doc = await payload.create({
      collection: 'images',
      data: { alt: 'red', ...data },
      file: { data: pngSource, mimetype: 'image/png', name: 'red.png', size: pngSource.byteLength },
      overrideAccess: true,
    })
    return doc.id
  }

  const createVariant = async (sourceId: string | number, cacheKey: string): Promise<void> => {
    await payload.create({
      collection: 'generatedImages',
      data: { source: sourceId, cacheKey, fit: 'cover', format: 'webp', quality: 75 },
      file: { data: webpVariant, mimetype: 'image/webp', name: `${cacheKey}.webp`, size: webpVariant.byteLength },
      overwriteExistingFiles: true,
      overrideAccess: true,
    })
  }

  it('purges all variants for a source via the authed endpoint', async () => {
    const id = await createSource()
    await createVariant(id, `${id}-a`)
    await createVariant(id, `${id}-b`)
    expect(await countVariants(payload, id)).toBe(2)

    const ep = (payload.config.endpoints ?? []).find((e: Endpoint) => e.method === 'post' && e.path === '/img/purge/:id')
    if (!ep) throw new Error('purge endpoint not registered')

    // Unauthed → 401, no deletion.
    const unauthed = await ep.handler({ payload, routeParams: { id }, headers: new Headers() } as unknown as PayloadRequest)
    expect(unauthed.status).toBe(401)
    expect(await countVariants(payload, id)).toBe(2)

    // Authed → deletes both.
    const res = await ep.handler({ payload, user: { id: 'u1' }, routeParams: { id }, headers: new Headers() } as unknown as PayloadRequest)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ deleted: 2 })
    expect(await countVariants(payload, id)).toBe(0)
  })

  it('purges a source’s variants when the source is deleted', async () => {
    const id = await createSource()
    await createVariant(id, `${id}-x`)
    expect(await countVariants(payload, id)).toBe(1)

    await payload.delete({ collection: 'images', id, overrideAccess: true })
    expect(await countVariants(payload, id)).toBe(0)
  })

  it('purges stale variants on a focal change but not on a metadata-only edit', async () => {
    const id = await createSource({ focalX: 50, focalY: 50 })
    await createVariant(id, `${id}-focal`)
    expect(await countVariants(payload, id)).toBe(1)

    // alt-only update → variants remain valid.
    await payload.update({ collection: 'images', id, data: { alt: 'renamed' }, overrideAccess: true })
    expect(await countVariants(payload, id)).toBe(1)

    // focal change → variants are now stale and purged.
    await payload.update({ collection: 'images', id, data: { focalX: 20, focalY: 80 }, overrideAccess: true })
    expect(await countVariants(payload, id)).toBe(0)
  })
})
