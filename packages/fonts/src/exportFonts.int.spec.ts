import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { bootPayload, teardown } from '@tools/test-helpers'
import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { fontsPlugin } from './plugin'
import type { ExportFontsResponse } from './endpoints/exportFonts'

const ORIG_DIR = path.join(os.tmpdir(), 'ap-fonts-export-original')
const OPT_DIR = path.join(os.tmpdir(), 'ap-fonts-export-optimized')
const fixture = fs.readFileSync(fileURLToPath(new URL('./__fixtures__/inter.woff2', import.meta.url)))

describe('fonts export endpoint (integration)', () => {
  let payload: Payload

  beforeAll(async () => {
    // The endpoint compares the Bearer token against process.env.PAYLOAD_SECRET.
    process.env.PAYLOAD_SECRET = 'test-secret'
    payload = await bootPayload([
      fontsPlugin({
        includeFontSet: true,
        fontOriginalOptions: { upload: { staticDir: ORIG_DIR } },
        fontOptimizedOptions: { upload: { staticDir: OPT_DIR } },
      }),
    ])
  })
  afterAll(async () => {
    await teardown(payload)
    for (const dir of [ORIG_DIR, OPT_DIR]) fs.rmSync(dir, { recursive: true, force: true })
  })

  it('resolves a role → one typeface → its served optimized files (array per role)', async () => {
    const upOriginal = async (name: string): Promise<string | number> => {
      const d = (await payload.create({
        collection: 'fontOriginal',
        overrideAccess: true,
        data: {},
        file: { data: fixture, name, mimetype: 'font/woff2', size: fixture.byteLength },
      } as Parameters<typeof payload.create>[0])) as { id: string | number }
      return d.id
    }
    const regular = await upOriginal('inter-regular.woff2')
    const bold = await upOriginal('inter-bold.woff2')
    // Saving the typeface triggers the optimize hook → two fontOptimized docs.
    const typeface = (await payload.create({
      collection: 'font',
      overrideAccess: true,
      data: {
        title: 'Inter',
        family: 'sans',
        weights: [
          { weight: '400', style: 'normal', file: regular },
          { weight: '700', style: 'normal', file: bold },
        ],
      },
    } as Parameters<typeof payload.create>[0])) as { id: string | number }
    await payload.updateGlobal({ slug: 'fontSet', overrideAccess: true, data: { sans: typeface.id } } as Parameters<typeof payload.updateGlobal>[0])

    const endpoint = payload.config.endpoints?.find((e) => typeof e.path === 'string' && e.path.includes('/fonts/export'))
    expect(endpoint).toBeDefined()
    const req = { payload, headers: new Headers({ authorization: 'Bearer test-secret' }) }
    const res = (await endpoint?.handler?.(req as never)) as Response
    const json = (await res.json()) as ExportFontsResponse

    expect(json.fonts.sans).toHaveLength(2)
    expect((json.fonts.sans ?? []).map((f) => f.weight).sort()).toEqual(['400', '700'])
    for (const f of json.fonts.sans ?? []) {
      expect(f.mimeType).toBe('font/woff2')
      expect(f.data.length).toBeGreaterThan(0)
    }
  })

  it('rejects an unauthorized request', async () => {
    const endpoint = payload.config.endpoints?.find((e) => typeof e.path === 'string' && e.path.includes('/fonts/export'))
    const req = { payload, headers: new Headers({ authorization: 'Bearer wrong' }) }
    const res = (await endpoint?.handler?.(req as never)) as Response
    expect(res.status).toBe(401)
  })
})
