'use client'

import { toast } from '@payloadcms/ui'
import type React from 'react'
import { Fragment, useCallback, useState } from 'react'

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
    async (e: React.MouseEvent<HTMLButtonElement>) => {
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
        toast.error(`An error occurred, please refresh and try again.`)
        return
      }

      setLoading(true)

      try {
        toast.promise(
          new Promise((resolve, reject) => {
            fetch(endpoint, { method: 'POST', credentials: 'include' })
              .then((res) => {
                if (res.ok) {
                  resolve(true)
                  setSeeded(true)
                } else reject('An error occurred while seeding.')
              })
              .catch((err) => reject(err))
          }),
          {
            loading: 'Seeding with data....',
            success: <SuccessMessage />,
            error: 'An error occurred while seeding.',
          },
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      }
    },
    [loading, seeded, error, endpoint],
  )

  let message = ''
  if (loading) message = ' (seeding...)'
  if (seeded) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <Fragment>
      <button className="seedButton" onClick={handleClick}>
        SEED DATABASE
      </button>
      {message}
    </Fragment>
  )
}

export default SeedButton
