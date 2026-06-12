import { bootPayload, teardown } from '@tools/test-helpers'
import type { Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { iconsPlugin } from '../plugin'
import { recordIconMiss } from './recordMiss'

describe('icon request tracking (integration)', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await bootPayload([iconsPlugin({ trackRequests: true })])
  })
  afterAll(async () => {
    await teardown(payload)
  })

  it('registers the iconRequest collection when trackRequests is on', () => {
    expect(payload.collections.iconRequest).toBeDefined()
  })

  it('creates a row on first miss, increments on repeat', async () => {
    await recordIconMiss(payload, 'ghost')
    await recordIconMiss(payload, 'ghost')

    const res = await payload.find({ collection: 'iconRequest', where: { name: { equals: 'ghost' } }, overrideAccess: true })
    expect(res.docs).toHaveLength(1)
    const doc = res.docs[0] as { count?: number; firstRequestedAt?: string; lastRequestedAt?: string }
    expect(doc.count).toBe(2)
    expect(doc.firstRequestedAt).toBeTruthy()
    expect(doc.lastRequestedAt).toBeTruthy()
  })

  it('tracks distinct names separately', async () => {
    await recordIconMiss(payload, 'phantom')
    const all = await payload.find({ collection: 'iconRequest', overrideAccess: true, limit: 0, pagination: false })
    const names = all.docs.map((d) => (d as { name?: string }).name).sort()
    expect(names).toEqual(['ghost', 'phantom'])
  })
})
