/**
 * `<ResponsiveImage>` — a wrapper holding the LQIP blur placeholder, with a plain
 * `<img>` (a `srcset` of on-demand transform URLs, settings baked into each entry)
 * that fades in over the blur on load. It needs only the image id; the endpoint
 * reads the focal point and crops server-side. The markup renders on the server;
 * only the tiny fade `<img>` (`FadeImg`) is a client component. Not `next/image`.
 *
 * `className` / `style` go on the wrapper (the image "box" — size/space/round it
 * with utilities there); `dataAttributes` go on the `<img>`.
 */
import type { CSSProperties, ImgHTMLAttributes, ReactElement } from 'react'

import { FadeImg } from './image.client'
import { parseAspectRatio, type Fit, type Format } from '../transform/params'
import { type BuildSrcsetOptions, buildSrcset, deriveVersion } from './buildSrcset'

/** A bare id, or a populated image doc (for natural dims, alt, blur placeholder, and the cache-busting version token). */
export type ResponsiveImageInput =
  | string
  | number
  | {
      id: string | number
      width?: number | null
      height?: number | null
      alt?: string | null
      blurDataUrl?: string | null
      filename?: string | null
      focalX?: number | null
      focalY?: number | null
    }

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
   * (full-bleed hero, carousel slide, map panel). The parent must be positioned. Blur + fade
   * still apply. Default false.
   */
  fill?: boolean
  quality?: number
  fit?: Fit
  format?: Format
  /** Width increment for the srcset. Default 50; raise it to emit fewer widths (and so generate fewer variants). */
  pixelStep?: number
  /** Override the source intrinsic width used to cap the srcset (else read from a populated doc). */
  sourceWidth?: number
  /** Max srcset entries before the step coarsens. Default 16. */
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
  /** Transform endpoint base path. Default `/api/img`; set this if you customized the plugin's `transform.path`. */
  path?: string
  /** Explicit cache-busting version token (`v=`); overrides the one derived from the doc's filename + focal. */
  version?: string
  /** Show the blur placeholder (auto-read from a populated doc's `blurDataUrl`). Default true. */
  blur?: boolean
  /** Explicit LQIP/blur data URL; overrides a populated doc's `blurDataUrl`. */
  blurDataURL?: string
  /** Fade the image in over the blur on load. Default true (only applies when a blur exists). */
  fade?: boolean
  /** Fade duration in ms. Default 400. */
  fadeDurationMs?: number
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
    blurDataURL,
    fade = true,
    fadeDurationMs = 400,
    dataAttributes,
  } = props

  const id = idOf(image)
  if (!id) return null

  const doc = typeof image === 'object' ? image : undefined
  const altText = alt ?? doc?.alt ?? ''
  const naturalW = doc?.width ?? undefined
  const naturalH = doc?.height ?? undefined
  const blurSrc = blur ? (blurDataURL ?? doc?.blurDataUrl ?? undefined) : undefined
  const fadeOn = fade && Boolean(blurSrc)
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
      <FadeImg
        src={src}
        srcSet={srcset}
        sizes={sizes}
        alt={altText}
        width={intrinsicW}
        height={intrinsicH}
        loading={priority ? 'eager' : (loading ?? 'lazy')}
        fetchPriority={priority ? 'high' : undefined}
        decoding={decoding}
        fadeMs={fadeOn ? fadeDurationMs : 0}
        baseStyle={{
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
