'use server'

import type { ImageChild as ImageChildType } from '@pro-laico/atomic/children/schema'
import type { RenderChild } from '@pro-laico/atomic/children'

import { ResponsiveImage, type ResponsiveImageProps } from '../../components/image'

/**
 * Renders the `ImageChild` block as a `<ResponsiveImage>` — a plain `<img>` whose
 * `srcset` points at the on-demand transform endpoint (no `next/image`). The render
 * props (alt, sizes, quality, aspectRatio, fit, priority/loading, blur) are computed
 * server-side by `SSRProps` and arrive on `pt.c.p`; data attributes on `pt.c.da`.
 * The endpoint reads the focal point from the image doc and crops accordingly.
 */
export const ImageChild: React.FC<RenderChild<ImageChildType>> = async (props) => {
  const { block, pt } = props

  if (!block?.image || typeof block.image === 'string') return <div className="w-full h-full bg-gray-200" />

  const cp = (pt?.c?.p ?? {}) as Partial<ResponsiveImageProps>
  const da = (pt?.c?.da ?? {}) as Record<string, string>

  return <ResponsiveImage image={block.image as ResponsiveImageProps['image']} {...cp} dataAttributes={da} />
}
