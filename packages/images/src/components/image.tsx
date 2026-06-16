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

import { type BuildSrcsetOptions, buildSrcset, deriveVersion } from './buildSrcset'
import { FadeImg } from './image.client'
import { parseAspectRatio, type Fit, type Format } from '../transform/params'

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
  /** Render aspect ratio (`16/9` | `"16:9"`); falls back to the doc's natural ratio. */
  aspectRatio?: number | string
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

// The endpoint already produced the right pixels; this CSS object-fit is just a
// hint for how the (pre-sized) image sits in its box. Map endpoint fits → valid CSS.
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
  const naturalW = doc?.width ?? undefined
  const naturalH = doc?.height ?? undefined
  const altText = alt ?? doc?.alt ?? ''
  const ar = parseAspectRatio(aspectRatio) ?? (naturalW && naturalH ? naturalW / naturalH : undefined)

  // LQIP placeholder: explicit prop wins, else the populated doc's generated blur.
  const blurSrc = blur ? (blurDataURL ?? doc?.blurDataUrl ?? undefined) : undefined
  const fadeOn = fade && Boolean(blurSrc)

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
    // Explicit prop wins; else derive from the doc's filename + focal so an edit busts caches.
    version: version ?? deriveVersion(doc),
  }
  const { srcset, src } = buildSrcset(id, opts)

  // Intrinsic attributes to reserve layout (reduce CLS).
  const intrinsicW = naturalW ?? (ar ? 1280 : undefined)
  const intrinsicH = naturalH ?? (ar && intrinsicW ? Math.round(intrinsicW / ar) : undefined)

  return (
    <span
      className={className}
      style={{
        display: 'block',
        overflow: 'hidden',
        width: '100%',
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
          height: 'auto',
          ...(ar ? { aspectRatio: String(ar) } : null),
          objectFit: CSS_OBJECT_FIT[fit],
        }}
        {...(dataAttributes as ImgHTMLAttributes<HTMLImageElement>)}
      />
    </span>
  )
}

export default ResponsiveImage
