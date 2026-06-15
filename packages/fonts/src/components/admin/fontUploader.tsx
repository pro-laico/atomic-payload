'use client'

import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast, useConfig, useField } from '@payloadcms/ui'

const ACCEPT = '.ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2'
const FONT_NAME_RE = /\.(ttf|otf|woff2?|woff)$/i

// Browsers frequently report fonts as `application/octet-stream`; send a real
// font mime derived from the extension so the server's mime whitelist accepts it.
const EXT_TO_MIME: Record<string, string> = { ttf: 'font/ttf', otf: 'font/otf', woff: 'font/woff', woff2: 'font/woff2' }
const fontMime = (name: string): string => EXT_TO_MIME[name.split('.').pop()?.toLowerCase() ?? ''] ?? 'font/ttf'

// Staged bytes ride the multipart `_payload` field of the save AS base64 (which
// is what's actually transmitted — ~1.33× the raw size). The plugin raises busboy's
// per-field cap so the batch isn't truncated; this guard measures the encoded
// length and keeps it under the platform request-body limit (~4.5 MB on Vercel,
// minus headroom for the rest of the doc). Above it, save what's staged and add
// the rest in another save.
const MAX_PENDING_ENCODED_BYTES = 4 * 1024 * 1024

const WEIGHT_OPTIONS = ['100', '200', '300', '400', '500', '600', '700', '800', '900']
const WEIGHT_LABELS: Record<string, string> = {
  '100': 'Thin',
  '200': 'ExtraLight',
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
  '900': 'Black',
}

/** Minimal shapes for the bundled `fontkit` browser build (dynamically imported). */
type FontkitModule = { create?: (data: Uint8Array) => unknown; default?: { create?: (data: Uint8Array) => unknown } }
type ParsedFontkit = {
  familyName?: string | null
  subfamilyName?: string | null
  italicAngle?: number
  'OS/2'?: { usWeightClass?: number; fsSelection?: number } | null
}

let uid = 0

type Style = 'normal' | 'italic'

/** A weight file: staged for this save (`pending`, holds base64) or already saved. */
interface Item {
  key: string
  status: 'pending' | 'saved'
  name: string
  weight: string
  style: Style
  mimetype: string
  size: number
  base64?: string
  id?: string | number
  savedPercent?: number
}
/** What gets sent with the document save for each staged file. */
type PendingEntry = { data: string; name: string; mimetype: string; weight: string; style: Style }

const normalizeWeight = (w?: number): string => {
  if (!w || Number.isNaN(w)) return '400'
  return String(Math.min(900, Math.max(100, Math.round(w / 100) * 100)))
}

const formatBytes = (n: number): string =>
  n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / (1024 * 1024)).toFixed(1)} MB`

// Trailing weight/style words to strip so a detected family like "Inter Black"
// collapses to the typeface base ("Inter") when naming the document.
const STRIP_WORDS = new Set([
  'thin',
  'hairline',
  'extralight',
  'ultralight',
  'light',
  'regular',
  'normal',
  'book',
  'text',
  'medium',
  'semibold',
  'demibold',
  'semi',
  'demi',
  'bold',
  'extrabold',
  'ultrabold',
  'extra',
  'ultra',
  'black',
  'heavy',
  'italic',
  'oblique',
])
const baseFamily = (name: string): string => {
  const tokens = name
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
  while (tokens.length > 1 && STRIP_WORDS.has(tokens[tokens.length - 1].toLowerCase())) tokens.pop()
  return tokens.join(' ') || name.trim()
}

/** Best-effort client-side metadata read via the bundled `fontkit` dependency. */
async function parseFont(file: File): Promise<{ familyName: string; weight: string; style: Style }> {
  const fallback = { familyName: baseFamily(file.name.replace(FONT_NAME_RE, '')), weight: '400', style: 'normal' as const }
  try {
    const mod = (await import('fontkit')) as unknown as FontkitModule
    const create = mod.create ?? mod.default?.create
    if (!create) return fallback
    const font = create(new Uint8Array(await file.arrayBuffer())) as ParsedFontkit
    const italic = Boolean(
      (typeof font.italicAngle === 'number' && font.italicAngle !== 0) ||
        (font['OS/2']?.fsSelection ?? 0) & 0x01 ||
        /italic|oblique/i.test(font.subfamilyName ?? ''),
    )
    return {
      familyName: font.familyName ? baseFamily(font.familyName) : fallback.familyName,
      weight: normalizeWeight(font['OS/2']?.usWeightClass),
      style: italic ? 'italic' : 'normal',
    }
  } catch {
    return fallback
  }
}

/** Read a File as raw base64 (strips the data: URL prefix); reliable for any size. */
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

const refId = (f: unknown): string | number | undefined => (f && typeof f === 'object' ? (f as { id?: string | number }).id : (f as string | number))
const toSaved = (d: Record<string, unknown>): Item => ({
  key: `e${d.id}`,
  status: 'saved',
  id: d.id as string | number,
  name: typeof d.filename === 'string' ? d.filename : String(d.id),
  weight: d.weight ? String(d.weight) : '400',
  style: d.style === 'italic' ? 'italic' : 'normal',
  mimetype: typeof d.mimeType === 'string' ? d.mimeType : 'font/woff2',
  size: typeof d.optimizedFilesize === 'number' ? d.optimizedFilesize : typeof d.filesize === 'number' ? d.filesize : 0,
  savedPercent: typeof d.savedPercent === 'number' ? d.savedPercent : undefined,
})

const styleRank = (s: Style) => (s === 'italic' ? 1 : 0)
const pendingEntries = (items: Item[]): PendingEntry[] =>
  items
    .filter((i) => i.status === 'pending' && i.base64)
    .map((i) => ({ data: i.base64 as string, name: i.name, mimetype: i.mimetype, weight: i.weight, style: i.style }))
const dupSet = (items: Item[]): Set<string> => {
  const counts = new Map<string, number>()
  for (const i of items) counts.set(`${i.weight}|${i.style}`, (counts.get(`${i.weight}|${i.style}`) ?? 0) + 1)
  return new Set([...counts].filter(([, n]) => n > 1).map(([k]) => k))
}

const panel: React.CSSProperties = {
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 'var(--style-radius-m, 4px)',
  background: 'var(--theme-elevation-50)',
  padding: '1rem',
}
const note: React.CSSProperties = { color: 'var(--theme-elevation-500)', fontSize: '0.8rem', margin: 0 }
const select: React.CSSProperties = {
  background: 'var(--theme-input-bg)',
  color: 'var(--theme-elevation-800)',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: '3px',
  padding: '0.2rem 0.4rem',
  fontSize: '0.8rem',
}

/**
 * The `files` field component for a `Font` (typeface) document: a drag-1-or-many
 * uploader. Dropped files are STAGED client-side (parsed with fontkit, held as
 * base64 in the hidden `pendingUploads` field) — nothing is created until you
 * Save. On save, a server hook turns each staged file into an optimized WOFF2
 * `fontFile` and links it into `files`; so abandoning the document creates no
 * orphaned files. Editing lists existing weight files and lets you add/remove.
 */
export const FontUploader: React.FC<{ path?: string }> = ({ path = 'files' }) => {
  const { config } = useConfig()
  const apiRoute = config?.routes?.api || '/api'

  const itemsRef = useRef<Item[]>([])
  // Require ≥1 file; block dup weight/style and over-large batches. Reads the
  // live item list via a ref so it's correct at submit time.
  const validate = useCallback(() => {
    const its = itemsRef.current
    if (its.length === 0) return 'Add at least one font file.'
    if (dupSet(its).size > 0) return 'Two files share the same weight + style — remove or re-tag one.'
    // Sum the base64 length actually sent (not the raw byte size) so the cap
    // matches the request-body limit the save will hit.
    const encodedBytes = its.filter((i) => i.status === 'pending').reduce((s, i) => s + (i.base64?.length ?? 0), 0)
    if (encodedBytes > MAX_PENDING_ENCODED_BYTES) return 'These fonts are too large to add in one save. Save what you have, then add the rest.'
    return true
  }, [])

  const {
    value: filesValue,
    setValue: setFiles,
    showError,
    errorMessage,
  } = useField<Array<string | number | Record<string, unknown>>>({ path, validate })
  const { setValue: setTitle } = useField<string>({ path: 'title' })
  const { setValue: setPending } = useField<PendingEntry[]>({ path: 'pendingUploads' })

  const [items, setItems] = useState<Item[]>([])
  itemsRef.current = items
  const [loadedExisting, setLoadedExisting] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const filesRef = useRef(filesValue)
  filesRef.current = filesValue
  const titleSetRef = useRef(false)

  // Update items + keep the staged-uploads field in sync (one place, deterministic).
  const commit = useCallback(
    (next: Item[]) => {
      itemsRef.current = next
      setItems(next)
      setPending(pendingEntries(next))
    },
    [setPending],
  )

  // On edit, hydrate the already-saved files from the document's `files`.
  useEffect(() => {
    if (loadedExisting) return
    const refs = Array.isArray(filesValue) ? filesValue : []
    if (refs.length === 0) {
      setLoadedExisting(true)
      return
    }
    const populated = refs.filter((r): r is Record<string, unknown> => Boolean(r) && typeof r === 'object' && 'weight' in (r as object))
    if (populated.length === refs.length) {
      const saved = populated.map(toSaved)
      itemsRef.current = saved
      setItems(saved)
      setLoadedExisting(true)
      return
    }
    const ids = refs.map(refId).filter((id): id is string | number => id != null)
    Promise.all(
      ids.map((id) =>
        fetch(`${apiRoute}/fontFile/${id}?depth=0`, { credentials: 'include' })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ),
    )
      .then((docs) => {
        const saved = docs.filter(Boolean).map((d) => toSaved(d as Record<string, unknown>))
        itemsRef.current = saved
        setItems(saved)
      })
      .finally(() => setLoadedExisting(true))
  }, [filesValue, loadedExisting, apiRoute])

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter((f) => FONT_NAME_RE.test(f.name) || f.type.startsWith('font/'))
      if (!files.length) return
      setParsing(true)
      const staged = await Promise.all(
        files.map(async (file): Promise<Item> => {
          const [base64, meta] = await Promise.all([toBase64(file), parseFont(file)])
          if (!titleSetRef.current && meta.familyName) {
            setTitle(meta.familyName)
            titleSetRef.current = true
          }
          return {
            key: `f${uid++}`,
            status: 'pending',
            name: file.name,
            weight: meta.weight,
            style: meta.style,
            mimetype: fontMime(file.name),
            size: file.size,
            base64,
          }
        }),
      )
      setParsing(false)
      commit([...itemsRef.current, ...staged])
    },
    [commit, setTitle],
  )

  const remove = (item: Item) => {
    commit(itemsRef.current.filter((it) => it.key !== item.key))
    // Saved files are de-referenced now; the server deletes them on save.
    if (item.status === 'saved' && item.id != null) {
      setFiles((Array.isArray(filesRef.current) ? filesRef.current : []).map(refId).filter((x): x is string | number => x != null && x !== item.id))
    }
  }

  const editMeta = (item: Item, next: Partial<Pick<Item, 'weight' | 'style'>>) => {
    commit(itemsRef.current.map((it) => (it.key === item.key ? { ...it, ...next } : it)))
    // A saved file already exists — patch its metadata immediately (no re-optimize).
    if (item.status === 'saved' && item.id != null) {
      const prev = { weight: item.weight, style: item.style }
      void fetch(`${apiRoute}/fontFile/${item.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      })
        // fetch only rejects on network failure — a 4xx/5xx still resolves, so
        // check `ok` explicitly, then roll the optimistic edit back to match the DB.
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`)
        })
        .catch(() => {
          toast.error('Could not update weight/style — reverted.')
          commit(itemsRef.current.map((it) => (it.key === item.key ? { ...it, ...prev } : it)))
        })
    }
  }

  const rows = useMemo(() => [...items].sort((a, b) => styleRank(a.style) - styleRank(b.style) || Number(b.weight) - Number(a.weight)), [items])
  const duplicateKeys = useMemo(() => dupSet(items), [items])

  return (
    <div>
      <div style={{ marginBottom: '0.5rem' }}>
        <strong style={{ fontSize: '0.95rem' }}>Weight files</strong>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            void addFiles(e.dataTransfer.files)
          }}
          style={{
            ...panel,
            width: '100%',
            textAlign: 'center',
            padding: items.length > 0 ? '0.75rem' : '2rem',
            cursor: 'pointer',
            borderStyle: 'dashed',
            borderColor: dragOver ? 'var(--theme-success-500)' : 'var(--theme-elevation-150)',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: items.length > 0 ? '0.85rem' : '1rem', marginBottom: items.length > 0 ? 0 : '0.35rem' }}>
            {parsing ? 'Reading fonts…' : items.length > 0 ? 'Drop more weights here, or click to browse' : 'Drop font files here'}
          </div>
          {items.length === 0 && (
            <p style={note}>One file or many — .ttf, .otf, .woff, .woff2. They're optimized to WOFF2 when you save the typeface.</p>
          )}
        </button>

        {rows.length > 0 && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', ...panel }}>
            {rows.map((row) => {
              const isDup = duplicateKeys.has(`${row.weight}|${row.style}`)
              return (
                <li key={row.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span
                    style={{ flex: '1 1 12rem', minWidth: '8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={row.name}
                  >
                    {row.name}
                  </span>
                  <select style={select} value={row.weight} onChange={(e) => editMeta(row, { weight: e.target.value })}>
                    {WEIGHT_OPTIONS.map((w) => (
                      <option key={w} value={w}>
                        {w} {WEIGHT_LABELS[w]}
                      </option>
                    ))}
                  </select>
                  <select style={select} value={row.style} onChange={(e) => editMeta(row, { style: e.target.value as Style })}>
                    <option value="normal">normal</option>
                    <option value="italic">italic</option>
                  </select>
                  <span style={{ ...note, minWidth: '8rem', textAlign: 'right' }}>
                    {isDup ? (
                      <span style={{ color: 'var(--theme-error-500)' }} title="Another file here has the same weight + style">
                        ⚠ duplicate
                      </span>
                    ) : row.status === 'saved' ? (
                      <span style={{ color: 'var(--theme-success-500)' }}>
                        ✓ {row.size ? formatBytes(row.size) : 'saved'}
                        {typeof row.savedPercent === 'number' ? ` · ${row.savedPercent}% smaller` : ''}
                      </span>
                    ) : (
                      `${formatBytes(row.size)} → WOFF2 on save`
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(row)}
                    style={{ ...note, background: 'none', border: 'none', cursor: 'pointer' }}
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {duplicateKeys.size > 0 && (
          <p style={{ ...note, color: 'var(--theme-error-500)' }}>
            Two files share the same weight + style — remove or re-tag one. Each weight + style is a single file.
          </p>
        )}
        {showError && errorMessage && <p style={{ ...note, color: 'var(--theme-error-500)' }}>{errorMessage}</p>}
        {items.some((i) => i.status === 'pending') && !showError && (
          <p style={note}>Pending files are optimized and saved when you Save the typeface.</p>
        )}
        <input ref={inputRef} type="file" accept={ACCEPT} multiple hidden onChange={(e) => e.target.files && void addFiles(e.target.files)} />
      </div>
    </div>
  )
}

export default FontUploader
