import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { startMongoReplSet, type MongoReplSet } from '@tools/test-helpers'
import { seed } from '@pro-laico/seed'
import { createLocalReq, getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

/**
 * End-to-end seed test for the atomic-payload starter template.
 *
 * Unlike the per-plugin `*.int.spec.ts` suites (minimal config, in-memory
 * SQLite), this boots the REAL, fully-composed template config — every plugin
 * wired exactly as shipped — against a real MongoDB replica set, then runs the
 * real `seed()`. That makes it the only suite that can reproduce Mongo-specific
 * and full-config seed failures (transactions, storage adapters, hook ordering).
 *
 * Notes:
 * - `BLOB_READ_WRITE_TOKEN` is intentionally empty so icon uploads never hit a
 *   real Vercel Blob store; they fall back to local disk instead. We run inside a
 *   throwaway temp cwd (below) so those files never land in the repo.
 * - Env is set BEFORE the dynamic config import because the template reads it at
 *   module-evaluation time (db url, server url, secret).
 */
describe('atomic-payload template seed (integration, MongoDB)', () => {
  let mongo: MongoReplSet
  let payload: Payload
  let originalCwd: string
  let workDir: string

  beforeAll(async () => {
    mongo = await startMongoReplSet()

    // Payload's local-disk upload fallback writes files relative to cwd. Run the
    // whole seed from a throwaway temp dir so no upload artifacts touch the repo.
    originalCwd = process.cwd()
    workDir = mkdtempSync(join(tmpdir(), 'ap-seed-'))
    process.chdir(workDir)

    process.env.MONGODB_URI = mongo.uri
    process.env.PAYLOAD_SECRET = 'test-secret'
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000'
    process.env.PREVIEW_SECRET = 'test-preview'
    process.env.FONT_DOWNLOAD_URL = 'http://localhost:3000'
    process.env.BLOB_READ_WRITE_TOKEN = ''

    // Mirror the template's instrumentation.ts: register the config with
    // @pro-laico/core so the workspace cache helpers can reach the Local API.
    const { registerPayloadConfig } = await import('@pro-laico/core/config')
    const { default: config } = await import('@/payload.config')
    registerPayloadConfig(config)
    payload = await getPayload({ config })
  })

  afterAll(async () => {
    await (payload?.db as { destroy?: () => Promise<void> })?.destroy?.()
    await mongo?.stop()
    if (originalCwd) process.chdir(originalCwd)
    if (workDir) rmSync(workDir, { recursive: true, force: true })
  })

  it('seeds the full template without error', async () => {
    const req = await createLocalReq({}, payload)

    await seed({ payload, req })

    const counts = Object.fromEntries(
      await Promise.all(
        (['pages', 'icon', 'iconSet', 'designSet', 'shortcutSet', 'forms', 'header', 'footer'] as const).map(
          async (collection) => [collection, (await payload.count({ collection, overrideAccess: true })).totalDocs] as const,
        ),
      ),
    )

    // Mirrors what seed/index.ts creates: 4 pages (testing, prose, home, 404),
    // 7 icons, and one of each set/global-backed collection.
    expect(counts).toMatchObject({
      pages: 4,
      icon: 7,
      iconSet: 1,
      designSet: 1,
      shortcutSet: 1,
      forms: 1,
    })

    // Every seeded icon must keep its own distinct filename. A duplicate would be
    // silently de-duped to `name-1.svg` by local-disk storage (hiding the bug),
    // but a cloud storage adapter rejects it on the `filename` unique index — so
    // assert the exact expected set rather than just the count.
    const iconDocs = await payload.find({ collection: 'icon', overrideAccess: true, limit: 0, pagination: false })
    const filenames = iconDocs.docs.map((d) => (d as { filename?: string }).filename).sort()
    expect(filenames).toEqual(['check.svg', 'close.svg', 'cookie.svg', 'github.svg', 'logo.svg', 'menu.svg', 'theme.svg'])

    const siteMeta = await payload.findGlobal({ slug: 'siteMetaData', overrideAccess: true })
    expect(siteMeta).toBeTruthy()

    // The final header create runs with isSeed:false, firing atomicHook → the CSS
    // processor, which writes the generated stylesheet into publishedStorage.
    const published = (await payload.findGlobal({ slug: 'publishedStorage', overrideAccess: true })) as { layoutCSS?: string }
    expect(published.layoutCSS?.length ?? 0).toBeGreaterThan(0)
  })
})
