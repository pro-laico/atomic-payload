import { afterEach, describe, expect, it, vi } from 'vitest'

import { readBytes } from './source'

const okResponse = (body: string): Response => ({ ok: true, arrayBuffer: async () => new TextEncoder().encode(body).buffer }) as unknown as Response

describe('readBytes URL resolution', () => {
  afterEach(() => vi.restoreAllMocks())

  it('fetches an absolute url as-is', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okResponse('abs'))
    const buf = await readBytes({ url: 'https://cdn.example/x.png' }, '/nonexistent', 'http://localhost:3000')
    expect(spy).toHaveBeenCalledWith('https://cdn.example/x.png', expect.anything())
    expect(buf?.toString()).toBe('abs')
  })

  it('resolves a relative url against the base url (the 502 fix)', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okResponse('rel'))
    const buf = await readBytes({ url: '/api/images/file/x.png' }, '/nonexistent', 'http://localhost:3000')
    expect(spy).toHaveBeenCalledWith('http://localhost:3000/api/images/file/x.png', expect.anything())
    expect(buf?.toString()).toBe('rel')
  })

  it('returns null for a relative url when no base url is available', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okResponse('x'))
    const buf = await readBytes({ url: '/api/images/file/x.png' }, '/nonexistent')
    expect(buf).toBeNull()
    expect(spy).not.toHaveBeenCalled()
  })

  it('returns null when the fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network'))
    const buf = await readBytes({ url: 'https://cdn.example/x.png' }, '/nonexistent')
    expect(buf).toBeNull()
  })
})

describe('readBytes SSRF guard', () => {
  afterEach(() => vi.restoreAllMocks())

  it('refuses to fetch the cloud metadata endpoint / private hosts (never calls fetch)', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okResponse('secret'))
    for (const url of [
      'http://169.254.169.254/latest/meta-data/',
      'http://127.0.0.1:8080/admin',
      'http://10.0.0.5/internal',
      'http://192.168.1.1/',
      'http://[::1]/',
    ]) {
      expect(await readBytes({ url }, '/nonexistent', 'https://site.example')).toBeNull()
    }
    expect(spy).not.toHaveBeenCalled()
  })

  it('still allows the trusted server origin itself even on localhost (dev self-fetch)', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okResponse('ok'))
    const buf = await readBytes({ url: '/api/images/file/x.png' }, '/nonexistent', 'http://localhost:3000')
    expect(buf?.toString()).toBe('ok')
    expect(spy).toHaveBeenCalledOnce()
  })

  it('passes redirect:manual and drops a redirect (non-ok) response', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: false, status: 0 } as unknown as Response)
    const buf = await readBytes({ url: 'https://cdn.example/x.png' }, '/nonexistent')
    expect(buf).toBeNull()
    expect(spy).toHaveBeenCalledWith('https://cdn.example/x.png', expect.objectContaining({ redirect: 'manual' }))
  })

  it('rejects a body whose content-length exceeds the cap', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      headers: { get: () => String(128 * 1024 * 1024) },
      arrayBuffer: async () => new ArrayBuffer(8),
    } as unknown as Response)
    const buf = await readBytes({ url: 'https://cdn.example/big.png' }, '/nonexistent')
    expect(buf).toBeNull()
  })
})
