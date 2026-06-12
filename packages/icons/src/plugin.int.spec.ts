import { bootPayload, teardown } from '@tools/test-helpers'
import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { iconsPlugin } from './plugin'

describe('iconsPlugin (integration)', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await bootPayload([iconsPlugin()])
  })
  afterAll(async () => {
    await teardown(payload)
  })

  it('registers the icon collection', () => {
    expect(payload.collections.icon).toBeDefined()
  })

  it('registers the iconSet collection (includeIconSet defaults true)', () => {
    expect(payload.collections.iconSet).toBeDefined()
  })

  it('does NOT register the iconRequest collection unless trackRequests is set', () => {
    expect(payload.collections.iconRequest).toBeUndefined()
  })
})
