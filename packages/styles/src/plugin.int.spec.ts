import { bootPayload, teardown } from '@tools/test-helpers'
import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { stylesPlugin } from './plugin'

describe('stylesPlugin (integration)', () => {
  let payload: Payload

  beforeAll(async () => {
    // styles relates to `pages` (owned by @pro-laico/site); stub it for isolation.
    payload = await bootPayload([stylesPlugin({})], { collections: [{ slug: 'pages', fields: [] }] })
  })
  afterAll(async () => {
    await teardown(payload)
  })

  it('registers the designSet collection', () => {
    expect(payload.collections.designSet).toBeDefined()
  })

  it('registers the shortcutSet collection', () => {
    expect(payload.collections.shortcutSet).toBeDefined()
  })
})
