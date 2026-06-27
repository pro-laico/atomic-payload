'use client'

import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDocumentInfo, useField, useForm, useUploadEdits } from '@payloadcms/ui'

import { coverObjectPosition } from '../../transform/geometry'

/**
 * An inline focal-point picker + live ratio preview for the Images upload edit
 * view. It ENHANCES Payload's native focal pipeline rather than competing with it:
 * the displayable source comes from the saved `url` or an object URL of the
 * just-selected `file` (the same way Payload's own Upload element resolves it), and
 * the focal point is written through the shared `UploadEdits` context — exactly what
 * the native "Edit image" selector uses — so the value persists (the server derives
 * `focalX/focalY` from it on save) and the two never conflict.
 *
 * The ratio tiles reproduce the transform endpoint's crop exactly: they share its
 * `coverCropGeometry` (via `coverObjectPosition`) to turn the focal point into the
 * matching `object-position`, rather than panning proportionally with a raw
 * `object-position: <focal>%` (which diverges from the endpoint in the mid-range).
 * No network calls.
 */

const DEFAULT_RATIOS = ['16:9', '9:16', '1:1', '4:3', '3:2', '21:9']

const ratioToCss = (r: string): string => r.replace(/[:/]/, ' / ')
const clampPct = (n: number): number => Math.max(0, Math.min(100, n))

interface FocalPreviewProps {
  previewRatios?: string[]
  readOnly?: boolean
}

const note: React.CSSProperties = { color: 'var(--theme-elevation-500)', fontSize: '0.8rem', margin: 0 }

export const FocalPreview: React.FC<FocalPreviewProps> = ({ previewRatios = DEFAULT_RATIOS, readOnly }) => {
  const { data } = useDocumentInfo()
  const { value: file } = useField<File | undefined>({ path: 'file' })
  const { uploadEdits, updateUploadEdits } = useUploadEdits()
  const { setModified } = useForm()

  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  useEffect(() => {
    if (file instanceof File && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setObjectUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setObjectUrl(null)
    return undefined
  }, [file])

  const savedUrl = typeof data?.url === 'string' ? data.url : null
  const src = savedUrl || objectUrl

  const focalX = uploadEdits?.focalPoint?.x ?? (typeof data?.focalX === 'number' ? data.focalX : 50)
  const focalY = uploadEdits?.focalPoint?.y ?? (typeof data?.focalY === 'number' ? data.focalY : 50)

  const [srcDims, setSrcDims] = useState<{ w: number; h: number } | null>(
    typeof data?.width === 'number' && typeof data?.height === 'number' ? { w: data.width, h: data.height } : null,
  )

  const stageRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const applyFromEvent = useCallback(
    (clientX: number, clientY: number) => {
      if (readOnly) return
      const el = stageRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const x = clampPct(((clientX - rect.left) / rect.width) * 100)
      const y = clampPct(((clientY - rect.top) / rect.height) * 100)
      updateUploadEdits({ ...uploadEdits, focalPoint: { x, y } })
      setModified(true)
    },
    [readOnly, uploadEdits, updateUploadEdits, setModified],
  )

  if (!src) {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <strong style={{ fontSize: '0.95rem' }}>Focus point</strong>
        <p style={note}>Upload an image to set its focus point and preview display ratios.</p>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <strong style={{ fontSize: '0.95rem' }}>Focus point</strong>
      <p style={{ ...note, marginBottom: '0.5rem' }}>
        {readOnly ? 'Focus point (read-only).' : 'Click or drag to set the focus point used when cropping to a ratio.'}
      </p>

      <div
        ref={stageRef}
        onPointerDown={(e) => {
          if (readOnly) return
          setDragging(true)
          e.currentTarget.setPointerCapture(e.pointerId)
          applyFromEvent(e.clientX, e.clientY)
        }}
        onPointerMove={(e) => {
          if (dragging) applyFromEvent(e.clientX, e.clientY)
        }}
        onPointerUp={(e) => {
          setDragging(false)
          e.currentTarget.releasePointerCapture?.(e.pointerId)
        }}
        style={{
          position: 'relative',
          maxWidth: 480,
          borderRadius: 'var(--style-radius-m, 4px)',
          overflow: 'hidden',
          border: '1px solid var(--theme-elevation-150)',
          cursor: readOnly ? 'default' : 'crosshair',
          touchAction: 'none',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* biome-ignore lint/performance/noImgElement: intentional plain <img> — admin preview that mirrors the frontend's object-position crop */}
        <img
          src={src}
          alt=""
          onLoad={(e) => setSrcDims({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
          style={{ display: 'block', width: '100%', height: 'auto' }}
          draggable={false}
        />
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: `${focalX}%`,
            top: `${focalY}%`,
            width: 16,
            height: 16,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '2px solid var(--theme-success-500, #22c55e)',
            boxShadow: '0 0 0 2px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.5rem', marginTop: '0.75rem' }}>
        {previewRatios.map((r) => {
          const [rw, rh] = r.split(/[:/]/).map(Number)
          const pos = srcDims && rw && rh ? coverObjectPosition(srcDims.w, srcDims.h, rw, rh, focalX, focalY) : { x: focalX, y: focalY }
          return (
            <figure key={r} style={{ margin: 0 }}>
              <div
                style={{
                  aspectRatio: ratioToCss(r),
                  overflow: 'hidden',
                  borderRadius: 'var(--style-radius-s, 3px)',
                  border: '1px solid var(--theme-elevation-100)',
                  background: 'var(--theme-elevation-50)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {/* biome-ignore lint/performance/noImgElement: intentional plain <img> — admin preview that mirrors the frontend's focal crop */}
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${pos.x}% ${pos.y}%` }}
                />
              </div>
              <figcaption style={{ ...note, textAlign: 'center', marginTop: '0.2rem' }}>{r}</figcaption>
            </figure>
          )
        })}
      </div>
    </div>
  )
}

export default FocalPreview
