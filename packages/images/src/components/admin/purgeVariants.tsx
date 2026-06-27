'use client'

import type React from 'react'
import { useState } from 'react'
import { toast, useConfig, useDocumentInfo } from '@payloadcms/ui'

/**
 * A button that purges every on-demand variant generated from this source image
 * (POST `<apiRoute><purgePath>/:id`, logged-in users only). Useful after editing the
 * focal point or re-uploading, or to reclaim storage. Only shown on a saved doc.
 *
 * `purgePath` defaults to the endpoint's fixed `/img/purge` route. The POST is
 * authenticated by Payload's session cookie (SameSite-protected).
 */
interface PurgeVariantsProps {
  /** Purge route under the API base. Default `/img/purge`. */
  purgePath?: string
}

const button: React.CSSProperties = {
  cursor: 'pointer',
  fontSize: '0.85rem',
  padding: '0.4rem 0.75rem',
  color: 'var(--theme-elevation-800)',
  background: 'var(--theme-elevation-50)',
  borderRadius: 'var(--style-radius-s, 3px)',
  border: '1px solid var(--theme-elevation-150)',
}

const note: React.CSSProperties = { color: 'var(--theme-elevation-500)', fontSize: '0.8rem', margin: '0.25rem 0 0' }

export const PurgeVariants: React.FC<PurgeVariantsProps> = ({ purgePath = '/img/purge' }) => {
  const { config } = useConfig()
  const { id } = useDocumentInfo()
  const apiRoute = config?.routes?.api || '/api'
  const [busy, setBusy] = useState(false)

  if (id == null) return null

  const purge = async (): Promise<void> => {
    setBusy(true)
    try {
      const res = await fetch(`${apiRoute}${purgePath}/${id}`, { method: 'POST', credentials: 'include' })
      const json = (await res.json().catch(() => ({}))) as { deleted?: number; error?: string } //TODO: replace `as` cast with proper typing
      if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`)
      const n = json?.deleted ?? 0
      toast.success(`Purged ${n} generated image${n === 1 ? '' : 's'}.`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to purge variants.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <button type="button" onClick={() => void purge()} disabled={busy} style={{ ...button, opacity: busy ? 0.6 : 1 }}>
        {busy ? 'Purging…' : 'Purge generated variants'}
      </button>
      <p style={note}>Deletes every on-demand image generated from this source. They regenerate on next request.</p>
    </div>
  )
}

export default PurgeVariants
