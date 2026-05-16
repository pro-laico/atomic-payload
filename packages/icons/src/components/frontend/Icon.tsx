'use server'
import React from 'react'
import { draftMode } from 'next/headers'
import getCached from '@pro-laico/core/cache/auto'
import { extractSvgContent, extractSvgProps } from '../../utilities/extractSVG'

/**
 * Inline fallback rendered when `name` doesn't resolve. Kept local so this
 * component has no runtime dependency on `@pro-laico/atomic` — a host project
 * that wants its own fallback should pass {@link IconProps.fallback}.
 */
const FALLBACK_WARNING_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="10.7 10.7 106.6 106.6" fill="currentColor" stroke="currentColor"><path d="M64 37.3a5.3 5.3 0 015.3 5.4v26.6a5.3 5.3 0 11-10.6 0V42.7a5.3 5.3 0 015.3-5.4m0 53.4A5.3 5.3 0 0064 80a5.3 5.3 0 000 10.7"/><path fill-rule="evenodd" d="M10.7 64a53.3 53.3 0 11106.6 0 53.3 53.3 0 01-106.6 0M64 21.3a42.7 42.7 0 100 85.4 42.7 42.7 0 000-85.4"/></svg>`

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /**
   * Icon name as defined in the active `IconSet`'s `iconsArray` (each entry's
   * kebab-cased `name` field). Resolved server-side via the cached icon/iconSet
   * getters so revalidating either tag invalidates only this `<svg>`, not the
   * surrounding page.
   */
  name: string
  /**
   * Optional fallback SVG string used when `name` doesn't match any icon in
   * the active set. Defaults to a small inline warning glyph.
   */
  fallback?: string
}

/**
 * Renders a CMS-managed icon by name. Server component — looks up the active
 * `IconSet`, finds the icon entry matching `name`, and inlines its `<svg>`
 * with its intrinsic attributes (viewBox, fill, etc.) merged with any JSX
 * props you pass.
 *
 * Props you pass on the JSX node ALWAYS win over the SVG source's intrinsic
 * attributes, so `className`, `style`, `width`, etc. override as expected.
 *
 * @example
 * ```tsx
 * import { Icon } from '@pro-laico/icons/Icon'
 *
 * <Icon name="arrow-right" />
 * <Icon name="arrow-right" className="size-6 text-primary" />
 * <Icon name="logo" fallback={myCustomSvgString} />
 * ```
 */
export const Icon: React.FC<IconProps> = async ({ name, fallback, ...svgProps }) => {
  const { isEnabled: draft } = await draftMode()
  const iconSet = await getCached('iconSet', draft)
  const svg = await getCached('icon', name, draft, iconSet)
  const source = svg || fallback || FALLBACK_WARNING_SVG
  return <svg {...extractSvgProps(source)} {...svgProps} dangerouslySetInnerHTML={{ __html: extractSvgContent(source) }} />
}

export default Icon
