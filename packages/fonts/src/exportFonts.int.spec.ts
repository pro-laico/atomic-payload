import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { bootPayload, teardown } from '@tools/test-helpers'
import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { fontsPlugin } from './plugin'
import type { ExportFontsResponse } from './endpoints/exportFonts'

const FONT_DIR = path.join(os.tmpdir(), 'ap-fonts-export-test')
const fixture = fs.readFileSync(fileURLToPath(new URL('./__fixtures__/inter.woff2', import.meta.url)))

describe('fonts export endpoint (integration)', () => {
  let payload: Payload

  beforeAll(async () => {
    // The endpoint compares the Bearer token against process.env.PAYLOAD_SECRET.
    process.env.PAYLOAD_SECRET = 'test-secret'
    payload = await bootPayload([fontsPlugin({ includeFontSet: true, fontFileOptions: { upload: { staticDir: FONT_DIR } } })])
  })
  afterAll(async () => {
    await teardown(payload)
    fs.rmSync(FONT_DIR, { recursive: true, force: true })
  })

  it('resolves a role → one typeface → its weight files (array per role)', async () => {
    const mk = async (weight: string, name: string): Promise<string | number> => {
      const d = (await payload.create({
        collection: 'fontFile',
        overrideAccess: true,
        data: { weight, style: 'normal' },
        file: { data: fixture, name, mimetype: 'font/woff2', size: fixture.byteLength },
      } as Parameters<typeof payload.create>[0])) as { id: string | number }
      return d.id
    }
    const regular = await mk('400', 'inter-regular.woff2')
    const bold = await mk('700', 'inter-bold.woff2')
    const typeface = (await payload.create({
      collection: 'font',
      overrideAccess: true,
      data: { title: 'Inter', family: 'sans', files: [regular, bold] },
    } as Parameters<typeof payload.create>[0])) as { id: string | number }
    await payload.updateGlobal({ slug: 'fontSet', overrideAccess: true, data: { sans: typeface.id } } as Parameters<typeof payload.updateGlobal>[0])

    const endpoint = payload.config.endpoints?.find((e) => typeof e.path === 'string' && e.path.includes('/fonts/export'))
    expect(endpoint).toBeDefined()
    const req = { payload, headers: new Headers({ authorization: 'Bearer test-secret' }) }
    const res = (await endpoint?.handler?.(req as never)) as Response
    const json = (await res.json()) as ExportFontsResponse

    expect(json.fonts.sans).toHaveLength(2)
    expect((json.fonts.sans ?? []).map((f) => f.weight).sort()).toEqual(['400', '700'])
    for (const f of json.fonts.sans ?? []) expect(f.data.length).toBeGreaterThan(0)
  })
})
