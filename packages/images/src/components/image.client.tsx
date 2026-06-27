'use client'

import { type CSSProperties, type ImgHTMLAttributes, type ReactElement, useEffect, useRef, useState } from 'react'

export interface FadeImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Fade-in duration in ms; `0` disables the fade. */
  fadeMs?: number
  /** Layout styles the fade's opacity composes with. */
  baseStyle?: CSSProperties
}

/**
 * An `<img>` that fades in on load. Images already `complete` at hydration
 * (cached, or loaded before JS ran) are revealed immediately so they're never
 * stuck transparent. The only client boundary in `<ResponsiveImage>`.
 *
 * When fading, the image starts at `opacity: 0` and is revealed by `onLoad` — which
 * needs JS. A `<noscript>` rule forces it visible when scripting is off (or the chunk
 * fails to hydrate), so a no-JS visitor never gets a permanently invisible image.
 */
export const FadeImg = ({ fadeMs = 0, baseStyle, style, onLoad, alt = '', ...rest }: FadeImgProps): ReactElement => {
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [])

  return (
    <>
      {fadeMs > 0 && (
        <noscript>
          <style>{'img[data-fade-img]{opacity:1!important}'}</style>
        </noscript>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* biome-ignore lint/performance/noImgElement: intentional plain <img> — this component ships a hand-built srcset + LQIP fade that next/image would defeat */}
      <img
        data-fade-img=""
        alt={alt}
        {...rest}
        ref={ref}
        onLoad={(e) => {
          setLoaded(true)
          onLoad?.(e)
        }}
        style={{ ...baseStyle, ...(fadeMs > 0 ? { opacity: loaded ? 1 : 0, transition: `opacity ${fadeMs}ms ease` } : null), ...style }}
      />
    </>
  )
}

export default FadeImg
