'use client'

import type React from 'react'
import { useMemo, useState } from 'react'
import { Button, Pill, toast, useAllFormFields } from '@payloadcms/ui'

import type { IconUsage, IconUsageManifest } from '../../scan/types'
import { clearIconRequests } from './clearIconRequests'

/** Matches the live `name` field of each `iconsArray` row so we can read the
 *  set's current names straight from form state (updates as you edit). */
const ICON_NAME_PATH = /^iconsArray\.\d+\.name$/

/** A name requested at runtime that didn't resolve (from the `iconRequest` collection). */
export interface LiveRequest {
  name: string
  count: number
  lastRequestedAt: string | null
}

export interface IconUsagePanelClientProps {
  /** The build-time manifest, or `null` when it hasn't been generated yet. */
  manifest: IconUsageManifest | null
  /** CLI command shown in the empty state so the editor knows how to populate it. */
  scanCommand: string
  /** Runtime misses recorded in production (empty unless `trackRequests` is on). */
  liveRequests: LiveRequest[]
}

const panelStyle: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 'var(--style-radius-m, 4px)',
  padding: '1rem',
  marginBlockStart: '0.5rem',
  background: 'var(--theme-elevation-50)',
}

const noteStyle: React.CSSProperties = { color: 'var(--theme-elevation-500)', fontSize: '0.8rem', margin: '0.25rem 0 0' }
const codeStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono, monospace)',
  background: 'var(--theme-elevation-100)',
  padding: '0.15rem 0.35rem',
  borderRadius: '3px',
}

/** Groups manifest usages by icon name, preserving the manifest's stable order. */
const groupByName = (usages: IconUsage[]): Map<string, IconUsage[]> => {
  const map = new Map<string, IconUsage[]>()
  for (const u of usages) {
    const list = map.get(u.name)
    if (list) list.push(u)
    else map.set(u.name, [u])
  }
  return map
}

const formatDate = (iso: string | null): string => {
  if (!iso) return ''
  const t = Date.parse(iso)
  return Number.isNaN(t) ? '' : new Date(t).toLocaleDateString()
}

/**
 * Three-way compare for the IconSet edit view: the names this repo requests in
 * code (the build-time manifest), the names actually requested in production
 * that didn't resolve (the `iconRequest` collection), and the names defined in
 * the set being edited (live form state). Adding a row clears its "missing"
 * badge immediately.
 */
export const IconUsagePanelClient: React.FC<IconUsagePanelClientProps> = ({ manifest, scanCommand, liveRequests }) => {
  const [fields] = useAllFormFields()
  // Local working copy so the "Clear runtime requests" action can empty the list
  // immediately without a full page reload.
  const [live, setLive] = useState<LiveRequest[]>(liveRequests)
  const [clearing, setClearing] = useState(false)

  // All hooks run unconditionally (before any early return) so hook order stays
  // stable across renders.
  const defined = useMemo(() => {
    const set = new Set<string>()
    for (const [path, state] of Object.entries(fields)) {
      const value = (state as { value?: unknown } | undefined)?.value
      if (ICON_NAME_PATH.test(path) && typeof value === 'string' && value.length > 0) set.add(value)
    }
    return set
  }, [fields])

  const usagesByName = useMemo(() => groupByName(manifest?.usages ?? []), [manifest])
  const liveByName = useMemo(() => new Map(live.map((r) => [r.name, r])), [live])

  const staticNames = manifest?.names ?? []
  // Union of names missing from this set: requested in code OR requested live.
  const missing = useMemo(() => {
    const names = new Set<string>()
    for (const n of staticNames) if (!defined.has(n)) names.add(n)
    for (const r of live) if (!defined.has(r.name)) names.add(r.name)
    return [...names].sort((a, b) => a.localeCompare(b))
  }, [staticNames, live, defined])

  const present = staticNames.filter((name) => defined.has(name))
  const liveMissing = live.filter((r) => !defined.has(r.name)).length

  const handleClear = async (): Promise<void> => {
    setClearing(true)
    try {
      const result = await clearIconRequests()
      if (result.success) {
        setLive([])
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to clear icon requests.')
    } finally {
      setClearing(false)
    }
  }

  if (!manifest && live.length === 0) {
    return (
      <div style={panelStyle}>
        <strong>Requested icons</strong>
        <p style={noteStyle}>
          No usage manifest found. Run <code style={codeStyle}>{scanCommand}</code> in your project to scan source for{' '}
          <code style={codeStyle}>{'<Icon name="…" />'}</code> and list the names your repo needs here. Enable{' '}
          <code style={codeStyle}>trackRequests</code> to also capture runtime misses.
        </p>
      </div>
    )
  }

  return (
    <div style={panelStyle}>
      <strong>Requested icons</strong>
      <p style={noteStyle}>
        {manifest ? (
          <>
            {present.length} of {staticNames.length} name{staticNames.length === 1 ? '' : 's'} requested in code are defined here.
          </>
        ) : (
          <>No build-time manifest — showing runtime requests only.</>
        )}
        {liveMissing > 0 ? ` ${liveMissing} requested in production but missing.` : missing.length === 0 ? ' All present ✅' : ''}
      </p>

      {live.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          {/* type="button" so it never submits the surrounding IconSet edit form. */}
          <Button type="button" buttonStyle="secondary" size="small" disabled={clearing} onClick={handleClear}>
            {clearing ? 'Clearing…' : `Clear ${live.length} runtime request${live.length === 1 ? '' : 's'}`}
          </Button>
        </div>
      )}

      {missing.length > 0 && (
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ ...noteStyle, fontWeight: 600 }}>Missing from this set</div>
          <ul style={{ listStyle: 'none', margin: '0.35rem 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {missing.map((name) => {
              const where = usagesByName.get(name) ?? []
              const first = where[0]
              const liveReq = liveByName.get(name)
              return (
                <li key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* Live (production) misses are the most urgent → error pill. */}
                  <Pill pillStyle={liveReq ? 'error' : 'warning'} size="small">
                    {name}
                  </Pill>
                  {first && (
                    <span style={{ ...noteStyle, margin: 0 }}>
                      <code style={codeStyle}>
                        {first.file}:{first.line}
                      </code>
                      {where.length > 1 ? ` +${where.length - 1} more` : ''}
                    </span>
                  )}
                  {liveReq && (
                    <span style={{ ...noteStyle, margin: 0 }}>
                      live ×{liveReq.count}
                      {liveReq.lastRequestedAt ? ` · last ${formatDate(liveReq.lastRequestedAt)}` : ''}
                      {!first ? ' · dynamic (not in code scan)' : ''}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {present.length > 0 && (
        <details style={{ marginTop: '0.75rem' }}>
          <summary style={{ ...noteStyle, margin: 0, cursor: 'pointer' }}>{present.length} present</summary>
          <ul style={{ listStyle: 'none', margin: '0.35rem 0 0', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {present.map((name) => (
              <li key={name}>
                <Pill pillStyle="white" size="small">
                  {name}
                </Pill>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}

export default IconUsagePanelClient
