import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

/**
 * Seed test for the styles-only example app. Boots the example's REAL Payload
 * config on in-memory SQLite and runs its extracted `seedStyles()` — the same
 * function the `/api/seed` route calls — then asserts the docs and the generated
 * stylesheet.
 *
 * Like the app's instrumentation.ts, the config is registered with
 * @pro-laico/core so the page `cssHook`'s CSS getters can reach the Local API.
 * No upload collections here, so no disk artifacts to clean up.
 */
describe('styles-only example seed', () => {
  let payload: Payload

  beforeAll(async () => {
    process.env.DATABASE_URI = ':memory:'
    process.env.PAYLOAD_SECRET = 'test-secret'
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://localhost:3000'

    const { registerPayloadConfig } = await import('@pro-laico/core/config')
    const { default: config } = await import('@/payload.config')
    registerPayloadConfig(config)
    payload = await getPayload({ config })
  })

  afterAll(async () => {
    await (payload?.db as { destroy?: () => Promise<void> })?.destroy?.()
  })

  it('creates the sets + page and generates the stylesheet', async () => {
    const { seedStyles } = await import('@/seed/seed')

    const result = await seedStyles({ payload })
    expect(result).toEqual({ shortcutSet: 'created', designSet: 'created', page: 'created' })

    const [shortcutSets, designSets, pages] = await Promise.all([
      payload.count({ collection: 'shortcutSet', overrideAccess: true }),
      payload.count({ collection: 'designSet', overrideAccess: true }),
      payload.count({ collection: 'pages', overrideAccess: true }),
    ])
    expect(shortcutSets.totalDocs).toBe(1)
    expect(designSets.totalDocs).toBe(1)
    expect(pages.totalDocs).toBe(1)

    // The published page's cssHook ran the CSS processor and wrote the compiled
    // stylesheet into publishedStorage — the whole point of the styles plugin.
    const published = (await payload.findGlobal({ slug: 'publishedStorage', overrideAccess: true })) as { layoutCSS?: string }
    expect(published.layoutCSS?.length ?? 0).toBeGreaterThan(0)
  })
})
