'use client'

import type React from 'react'
import { Fragment, useCallback, useState } from 'react'

import { toast } from '@payloadcms/ui'

const SuccessMessage: React.FC = () => (
  <div>
    Database seeded! You can now{' '}
    <a target="_blank" href="/" rel="noreferrer">
      visit your website
    </a>
  </div>
)

export interface SeedButtonProps {
  /** Endpoint URL the button POSTs to. Defaults to `/api/seed`. */
  endpoint?: string
}

export const SeedButton: React.FC<SeedButtonProps> = ({ endpoint = '/api/seed' }) => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      if (seeded) {
        toast.info('Database already seeded.')
        return
      }
      if (loading) {
        toast.info('Seeding already in progress.')
        return
      }
      if (error) {
        toast.error('An error occurred, please refresh and try again.')
        return
      }

      setLoading(true)

      const run = fetch(endpoint, { method: 'POST', credentials: 'include' })
        .then((res) => {
          if (!res.ok) throw new Error('An error occurred while seeding.')
          setSeeded(true)
          return true
        })
        .catch((err) => {
          const e2 = err instanceof Error ? err : new Error(String(err))
          setError(e2.message)
          throw e2
        })
        .finally(() => setLoading(false))

      toast.promise(run, {
        loading: 'Seeding with data....',
        success: <SuccessMessage />,
        error: 'An error occurred while seeding.',
      })
    },
    [loading, seeded, error, endpoint],
  )

  let message = ''
  if (loading) message = ' (seeding...)'
  if (seeded) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <Fragment>
      <button type="button" className="seedButton" onClick={handleClick} disabled={loading || seeded} aria-busy={loading}>
        SEED DATABASE
      </button>
      {message}
    </Fragment>
  )
}

export default SeedButton
