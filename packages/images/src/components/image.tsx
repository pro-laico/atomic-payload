/**
 * `<ResponsiveImage>` — a wrapper carrying an LQIP placeholder (the smallest transform
 * variant, set as the wrapper's background and upscaled by the browser to a soft blur),
 * with a plain `<img>` (a `srcset` of on-demand transform URLs, settings baked into each
 * entry) painted over it: the placeholder shows until the real image downloads and covers
 * it. It needs only the image id; the endpoint reads the focal point and crops server-side.
 * Fully server-rendered — no client component, no hydration, no stored placeholder field —
 * so it drops into any server OR client tree. Not `next/image`.
 *
 * `className` / `style` go on the wrapper (the image "box" — size/space/round it
 * with utilities there); `dataAttributes` go on the `<img>`.
 */
import type { CSSProperties, ImgHTMLAttributes, ReactElement } from 'react'

import { parseAspectRatio, type Fit, type Format } from '../transform/params'
import { type BuildSrcsetOptions, buildSrcset, buildVariantUrl, deriveVersion } from './buildSrcset'

/** A bare id, or a populated image doc (for natural dims, alt, and the cache-busting version token). */
export type ResponsiveImageInput =
  | string
  | number
  | {
      id: string | number
      width?: number | null
      height?: number | null
      alt?: string | null
      filename?: string | null
      focalX?: number | null
      focalY?: number | null
    }

/** Width / quality of the LQIP placeholder variant — tiny on purpose; the browser upscales it to a soft blur. */
const PLACEHOLDER_WIDTH = 32
const PLACEHOLDER_QUALITY = 40

export interface ResponsiveImageProps {
  image: ResponsiveImageInput
  alt?: string
  /** The `sizes` attribute. Default `100vw`. */
  sizes?: string
  /** Render aspect ratio (`16/9` | `"16:9"`); falls back to the doc's natural ratio. Ignored when `fill` is set. */
  aspectRatio?: number | string
  /**
   * Cover-fill a height-driven parent instead of acting as an aspect-ratio box. The wrapper
   * becomes `position:absolute; inset:0; size:100%` and the `<img>` renders `width/height:100%`
   * with `object-fit:<fit>` and NO aspect-ratio — so it fills a parent that sets its own height
   * (full-bleed hero, carousel slide, map panel). The parent must be positioned. The placeholder
   * still applies. Default false.
   */
  fill?: boolean
  quality?: number
  fit?: Fit
  format?: Format
  /** Width increment for the srcset. Default 50; raise it to emit fewer widths (and so generate fewer variants). */
  pixelStep?: number
  /** Override the source intrinsic width used to cap the srcset (else read from a populated doc). */
  sourceWidth?: number
  /** Max srcset entries before the step coarsens. Default 8. */
  maxEntries?: number
  priority?: boolean
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'auto' | 'sync'
  /** Applied to the wrapper (the image box). */
  className?: string
  /** Merged onto the wrapper (the image box). */
  style?: CSSProperties
  /** Absolute base for the generated URLs (default same-origin). */
  baseUrl?: string
  /** Transform endpoint base. Default `/api/img`; set it only if your Payload API route or Next.js basePath differs. */
  path?: string
  /** Explicit cache-busting version token (`v=`); overrides the one derived from the doc's filename + focal. */
  version?: string
  /** Show the LQIP placeholder (a tiny transform variant, painted as the wrapper background). Default true. */
  blur?: boolean
  /** Extra attributes (e.g. `data-*`) spread onto the `<img>`. */
  dataAttributes?: Record<string, string>
}

const CSS_OBJECT_FIT: Record<Fit, NonNullable<CSSProperties['objectFit']>> = {
  cover: 'cover',
  contain: 'contain',
  fill: 'fill',
  inside: 'contain',
  outside: 'cover',
}

const idOf = (image: ResponsiveImageInput): string => (typeof image === 'object' ? String(image.id ?? '') : String(image ?? ''))

export const ResponsiveImage = (props: ResponsiveImageProps): ReactElement | null => {
  const {
    image,
    alt,
    sizes = '100vw',
    aspectRatio,
    fill = false,
    quality = 75,
    fit = 'cover',
    format = 'auto',
    pixelStep,
    sourceWidth,
    maxEntries,
    priority,
    loading,
    decoding = 'async',
    className,
    style,
    baseUrl,
    path,
    version,
    blur = true,
    dataAttributes,
  } = props

  const id = idOf(image)
  if (!id) return null

  const doc = typeof image === 'object' ? image : undefined
  const altText = alt ?? doc?.alt ?? ''
  const naturalW = doc?.width ?? undefined
  const naturalH = doc?.height ?? undefined
  const ar = fill ? undefined : (parseAspectRatio(aspectRatio) ?? (naturalW && naturalH ? naturalW / naturalH : undefined))

  const opts: BuildSrcsetOptions = {
    fit,
    quality,
    format,
    aspectRatio: ar,
    baseUrl,
    path,
    pixelStep,
    sourceWidth: sourceWidth ?? naturalW,
    maxEntries,
    version: version ?? deriveVersion(doc),
  }
  const { srcset, src } = buildSrcset(id, opts)
  // The LQIP placeholder is the smallest transform variant (a tiny, low-quality crop sharing the
  // same fit/format/focal/version); the browser upscales it to a soft blur behind the real image.
  const blurSrc = blur ? buildVariantUrl(id, PLACEHOLDER_WIDTH, { ...opts, quality: PLACEHOLDER_QUALITY }) : undefined

  const intrinsicW = naturalW ?? (ar ? 1280 : undefined)
  const intrinsicH = naturalH ?? (ar && intrinsicW ? Math.round(intrinsicW / ar) : undefined)

  return (
    <span
      className={className}
      style={{
        display: 'block',
        overflow: 'hidden',
        width: '100%',
        ...(fill ? { position: 'absolute', inset: 0, height: '100%' } : null),
        ...(blurSrc
          ? { backgroundImage: `url(${blurSrc})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }
          : null),
        ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* biome-ignore lint/performance/noImgElement: intentional plain <img> — a hand-built srcset + LQIP that next/image would defeat */}
      <img
        src={src}
        srcSet={srcset}
        sizes={sizes}
        alt={altText}
        width={intrinsicW}
        height={intrinsicH}
        loading={priority ? 'eager' : (loading ?? 'lazy')}
        fetchPriority={priority ? 'high' : undefined}
        decoding={decoding}
        style={{
          display: 'block',
          width: '100%',
          height: fill ? '100%' : 'auto',
          ...(ar ? { aspectRatio: String(ar) } : null),
          objectFit: CSS_OBJECT_FIT[fit],
        }}
        {...(dataAttributes as ImgHTMLAttributes<HTMLImageElement>)} //TODO: replace `as` cast with proper typing
      />
    </span>
  )
}

export default ResponsiveImage
