'use server'
import { draftMode } from 'next/headers'
import Warning from '@/ui/assets/warningIcon'
import getCached from '@/utilities/get/cache'
import { IconChild as IconChildType, RenderChild } from '@/ts/types'
import { extractSvgContent, extractSvgProps } from '@/utilities/extractSVG'

export const IconChild: React.FC<RenderChild<IconChildType>> = async ({ block: { icon }, pt }) => {
  const { isEnabled: draft } = await draftMode()
  if (!icon) return <svg {...pt?.c?.p} {...extractSvgProps(Warning)} dangerouslySetInnerHTML={{ __html: extractSvgContent(Warning) }} />

  // Ensures that if iconSet or the original icon doc is revalidated, the icon will be set as stale, but the page itself will not.
  const iconSet = await getCached({ tag: 'iconSet', draft })
  const svg = await getCached({ tag: 'icon', draft, tid: icon, iconSet })

  return <svg {...pt?.c?.p} {...extractSvgProps(svg || Warning)} dangerouslySetInnerHTML={{ __html: extractSvgContent(svg || Warning) }} />
}
