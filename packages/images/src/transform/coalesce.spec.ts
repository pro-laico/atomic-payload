import { describe, expect, it } from 'vitest'

import { createSingleFlight } from './coalesce'

describe('createSingleFlight', () => {
  it('runs the fn once for concurrent calls with the same key and shares the result', async () => {
    const flight = createSingleFlight<string, number>()
    let calls = 0
    const fn = (): Promise<number> =>
      new Promise((res) => {
        calls++
        setTimeout(() => res(calls), 10)
      })
    const [a, b, c] = await Promise.all([flight('k', fn), flight('k', fn), flight('k', fn)])
    expect(calls).toBe(1)
    expect([a, b, c]).toEqual([1, 1, 1])
  })

  it('runs separately for different keys', async () => {
    const flight = createSingleFlight<string, string>()
    const [a, b] = await Promise.all([
      flight('a', async () => 'A'),
      flight('b', async () => 'B'),
    ])
    expect([a, b]).toEqual(['A', 'B'])
  })

  it('clears the entry after settle so a later call re-runs (zero staleness)', async () => {
    const flight = createSingleFlight<string, number>()
    let calls = 0
    const fn = async (): Promise<number> => ++calls
    expect(await flight('k', fn)).toBe(1)
    expect(await flight('k', fn)).toBe(2)
  })

  it('clears the entry on rejection too', async () => {
    const flight = createSingleFlight<string, number>()
    let calls = 0
    await expect(
      flight('k', async () => {
        calls++
        throw new Error('boom')
      }),
    ).rejects.toThrow('boom')
    expect(await flight('k', async () => 99)).toBe(99)
    expect(calls).toBe(1)
  })
})
