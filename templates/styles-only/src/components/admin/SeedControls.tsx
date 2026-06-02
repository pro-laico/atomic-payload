'use client'

import { toast } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useCallback, useState } from 'react'

const SeededMessage: React.FC = () => (
  <div>
    Seeded! Now{' '}
    <a target="_blank" href="/" rel="noreferrer">
      view the site
    </a>
    .
  </div>
)

/**
 * Client controls embedded in the admin dashboard. The admin user is already
 * authenticated, so a plain `fetch(..., { credentials: 'include' })` to the
 * auth-gated `/api/seed` + `/api/reset` endpoints just works.
 */
export const SeedControls: React.FC = () => {
  const router = useRouter()
  const [busy, setBusy] = useState<null | 'seed' | 'reset'>(null)

  const run = useCallback(
    (endpoint: string, kind: 'seed' | 'reset') => async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (busy) {
        toast.info('Already working…')
        return
      }
      setBusy(kind)
      try {
        await toast.promise(
          fetch(endpoint, { method: 'POST', credentials: 'include' }).then((res) => {
            if (!res.ok) throw new Error(`Request failed (${res.status})`)
            return res.json()
          }),
          {
            loading: kind === 'seed' ? 'Seeding…' : 'Resetting…',
            success: kind === 'seed' ? <SeededMessage /> : 'Reset — all sets and pages deleted.',
            error: 'Something went wrong. Check the server logs.',
          },
        )
        router.refresh()
      } finally {
        setBusy(null)
      }
    },
    [busy, router],
  )

  return (
    <div className="seed-controls">
      <button type="button" className="btn btn--style-primary btn--size-medium" disabled={busy !== null} onClick={run('/api/seed', 'seed')}>
        {busy === 'seed' ? 'Seeding…' : 'Seed sample data'}
      </button>
      <button type="button" className="btn btn--style-secondary btn--size-medium" disabled={busy !== null} onClick={run('/api/reset', 'reset')}>
        {busy === 'reset' ? 'Resetting…' : 'Reset'}
      </button>
    </div>
  )
}

export default SeedControls
