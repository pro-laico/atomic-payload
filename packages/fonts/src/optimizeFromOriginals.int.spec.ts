import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { bootPayload, teardown } from '@tools/test-helpers'
import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { fontsPlugin } from './plugin'

const ORIG_DIR = path.join(os.tmpdir(), 'ap-fonts-original-test')
const OPT_DIR = path.join(os.tmpdir(), 'ap-fonts-optimized-test')
const fixture = fs.readFileSync(fileURLToPath(new URL('./__fixtures__/inter.woff2', import.meta.url)))
const variableFixture = fs.readFileSync(fileURLToPath(new URL('./__fixtures__/inter-variable.woff2', import.meta.url)))

type Doc = Record<string, unknown>
type Id = string | number

describe('fonts optimize-from-originals (integration)', () => {
  let payload: Payload

  beforeAll(async () => {
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

  /** Upload a raw font into `fontOriginal`, returning its id. */
  const upOriginal = async (data: Buffer, name: string): Promise<Id> => {
    const doc = (await payload.create({
      collection: 'fontOriginal',
      overrideAccess: true,
      data: {},
      file: { data, name, mimetype: 'font/woff2', size: data.byteLength },
    } as Parameters<typeof payload.create>[0])) as Doc
    return doc.id as Id
  }
  const optimizedFor = async (fontId: Id): Promise<Doc[]> => {
    const res = await payload.find({ collection: 'fontOptimized' as never, where: { font: { equals: fontId } }, overrideAccess: true, limit: 100 })
    return res.docs as Doc[]
  }
  const originalExists = async (id: Id): Promise<boolean> => {
    try {
      await payload.findByID({ collection: 'fontOriginal' as never, id, overrideAccess: true })
      return true
    } catch {
      return false
    }
  }
  const deleteFont = (id: Id) => payload.delete({ collection: 'font', id, overrideAccess: true } as unknown as Parameters<typeof payload.delete>[0])

  it('builds an optimized WOFF2 per weight row on save (weight/style from the row)', async () => {
    const a = await upOriginal(fixture, 'Inter-Regular.woff2')
    const b = await upOriginal(fixture, 'Inter-Bold.woff2')
    const font = (await payload.create({
      collection: 'font',
      overrideAccess: true,
      data: {
        title: 'Inter',
        family: 'sans',
        weights: [
          { weight: '400', style: 'normal', file: a },
          { weight: '700', style: 'normal', file: b },
        ],
      },
    } as Parameters<typeof payload.create>[0])) as Doc

    const opt = await optimizedFor(font.id as Id)
    expect(opt).toHaveLength(2)
    for (const d of opt) expect(d.mimeType).toBe('font/woff2')
    expect(opt.map((d) => d.weight).sort()).toEqual(['400', '700'])
    expect(opt.every((d) => d.style === 'normal')).toBe(true)
    expect(opt.every((d) => d.isVariable === false)).toBe(true)
  })

  it('detects a variable upright + italic into ranged optimized files', async () => {
    const up = await upOriginal(variableFixture, 'Inter-Variable.woff2')
    const it = await upOriginal(variableFixture, 'Inter-Variable-Italic.woff2')
    const font = (await payload.create({
      collection: 'font',
      overrideAccess: true,
      data: { title: 'Inter Variable', family: 'display', variable: { upright: up, italic: it } },
    } as Parameters<typeof payload.create>[0])) as Doc

    const opt = await optimizedFor(font.id as Id)
    expect(opt).toHaveLength(2)
    for (const d of opt) {
      expect(d.weight).toBe('100 900')
      expect(d.isVariable).toBe(true)
      expect(d.mimeType).toBe('font/woff2')
    }
    expect(opt.map((d) => d.style).sort()).toEqual(['italic', 'normal'])
  })

  it('reconciles on update: a removed weight drops its optimized file', async () => {
    const a = await upOriginal(fixture, 'Recon-Regular.woff2')
    const b = await upOriginal(fixture, 'Recon-Bold.woff2')
    const font = (await payload.create({
      collection: 'font',
      overrideAccess: true,
      data: {
        title: 'Recon',
        family: 'serif',
        weights: [
          { weight: '400', style: 'normal', file: a },
          { weight: '700', style: 'normal', file: b },
        ],
      },
    } as Parameters<typeof payload.create>[0])) as Doc
    expect(await optimizedFor(font.id as Id)).toHaveLength(2)

    await payload.update({
      collection: 'font',
      id: font.id as Id,
      overrideAccess: true,
      data: { weights: [{ weight: '400', style: 'normal', file: a }] },
    } as Parameters<typeof payload.update>[0])

    const opt = await optimizedFor(font.id as Id)
    expect(opt).toHaveLength(1)
    expect(opt[0].weight).toBe('400')
  })

  it('deletes the orphaned original when a slot file is swapped (and not shared)', async () => {
    const a = await upOriginal(fixture, 'Swap-A.woff2')
    const b = await upOriginal(fixture, 'Swap-B.woff2')
    const font = (await payload.create({
      collection: 'font',
      overrideAccess: true,
      data: { title: 'Swap', family: 'sans', weights: [{ weight: '400', style: 'normal', file: a }] },
    } as Parameters<typeof payload.create>[0])) as Doc
    expect(await originalExists(a)).toBe(true)

    // Swap the slot's file A -> B; A is now de-referenced.
    await payload.update({
      collection: 'font',
      id: font.id as Id,
      overrideAccess: true,
      data: { weights: [{ weight: '400', style: 'normal', file: b }] },
    } as Parameters<typeof payload.update>[0])

    expect(await originalExists(a)).toBe(false)
    expect(await originalExists(b)).toBe(true)
    expect(await optimizedFor(font.id as Id)).toHaveLength(1)
  })

  it('cascades delete to optimized + original files', async () => {
    const a = await upOriginal(fixture, 'Doomed-Regular.woff2')
    const font = (await payload.create({
      collection: 'font',
      overrideAccess: true,
      data: { title: 'Doomed', family: 'mono', weights: [{ weight: '400', style: 'normal', file: a }] },
    } as Parameters<typeof payload.create>[0])) as Doc
    expect(await optimizedFor(font.id as Id)).toHaveLength(1)

    await deleteFont(font.id as Id)

    expect(await optimizedFor(font.id as Id)).toHaveLength(0)
    expect(await originalExists(a)).toBe(false)
  })

  it('rejects a typeface with no files', async () => {
    await expect(
      payload.create({ collection: 'font', overrideAccess: true, data: { title: 'Empty', family: 'sans' } } as Parameters<typeof payload.create>[0]),
    ).rejects.toThrow(/at least one/i)
  })

  it('rejects mixing a variable font with specific weights', async () => {
    const v = await upOriginal(variableFixture, 'Mix-Variable.woff2')
    const w = await upOriginal(fixture, 'Mix-Regular.woff2')
    await expect(
      payload.create({
        collection: 'font',
        overrideAccess: true,
        data: { title: 'Mixed', family: 'sans', variable: { upright: v }, weights: [{ weight: '400', style: 'normal', file: w }] },
      } as Parameters<typeof payload.create>[0]),
    ).rejects.toThrow(/either a variable font or specific/i)
  })

  it('rejects two weight rows at the same weight + style', async () => {
    const a = await upOriginal(fixture, 'Dup-A.woff2')
    const b = await upOriginal(fixture, 'Dup-B.woff2')
    await expect(
      payload.create({
        collection: 'font',
        overrideAccess: true,
        data: {
          title: 'Dupe',
          family: 'sans',
          weights: [
            { weight: '400', style: 'normal', file: a },
            { weight: '400', style: 'normal', file: b },
          ],
        },
      } as Parameters<typeof payload.create>[0]),
    ).rejects.toThrow(/weights/i)
  })

  it('rejects referencing an original already used by another typeface', async () => {
    const shared = await upOriginal(variableFixture, 'Guard-Shared.woff2')
    await payload.create({
      collection: 'font',
      overrideAccess: true,
      data: { title: 'Owner', family: 'sans', variable: { upright: shared } },
    } as Parameters<typeof payload.create>[0])
    await expect(
      payload.create({
        collection: 'font',
        overrideAccess: true,
        data: { title: 'Thief', family: 'serif', variable: { upright: shared } },
      } as Parameters<typeof payload.create>[0]),
    ).rejects.toThrow(/already used by/i)
  })

  it('lets a typeface re-save its own original (self is not a conflict)', async () => {
    const own = await upOriginal(variableFixture, 'Guard-Self.woff2')
    const font = (await payload.create({
      collection: 'font',
      overrideAccess: true,
      data: { title: 'Keeper', family: 'mono', variable: { upright: own } },
    } as Parameters<typeof payload.create>[0])) as Doc
    // Re-submitting the same slot value must NOT trip the uniqueness guard.
    await expect(
      payload.update({
        collection: 'font',
        id: font.id as Id,
        overrideAccess: true,
        data: { title: 'Keeper renamed', variable: { upright: own } },
      } as Parameters<typeof payload.update>[0]),
    ).resolves.toBeTruthy()
  })
})
