'use client'

import type React from 'react'
import { toast } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

const SeededMessage: React.FC = () => (
  <div>
    Images seeded! Now{' '}
    <a target="_blank" href="/" rel="noreferrer">
      view the demo
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
  const [seeded, setSeeded] = useState(false)

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
            loading: kind === 'seed' ? 'Uploading images…' : 'Resetting…',
            success: kind === 'seed' ? <SeededMessage /> : 'Reset — all images deleted.',
            error: 'Something went wrong. Check the server logs.',
          },
        )
        // A successful seed surfaces a persistent link to the demo; a reset clears it.
        setSeeded(kind === 'seed')
        router.refresh()
      } finally {
        setBusy(null)
      }
    },
    [busy, router],
  )

  return (
    <div className="seed-controls">
      <div className="seed-controls__buttons">
        <button type="button" className="btn btn--style-primary btn--size-medium" disabled={busy !== null} onClick={run('/api/seed', 'seed')}>
          {busy === 'seed' ? 'Uploading…' : 'Seed sample images'}
        </button>
        <button type="button" className="btn btn--style-secondary btn--size-medium" disabled={busy !== null} onClick={run('/api/reset', 'reset')}>
          {busy === 'reset' ? 'Resetting…' : 'Reset'}
        </button>
      </div>
      {seeded && (
        <a className="seed-controls__view" target="_blank" href="/" rel="noreferrer">
          View the seeded images on the home screen →
        </a>
      )}
    </div>
  )
}

export default SeedControls
