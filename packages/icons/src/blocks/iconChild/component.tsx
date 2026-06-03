import 'server-only'

import type { RenderChild } from '@pro-laico/atomic/children'
import Warning from '@pro-laico/atomic/children/admin/warningIcon'
import type { IconChild as IconChildType } from '@pro-laico/atomic/children/schema'
import getCached from '@pro-laico/core/cache/auto'
import { extractSvgContent, extractSvgProps } from '@pro-laico/icons'
import { draftMode } from 'next/headers'

export const IconChild: React.FC<RenderChild<IconChildType>> = async ({ block: { icon }, pt }) => {
  const { isEnabled: draft } = await draftMode()
  if (!icon) return <svg {...pt?.c?.p} {...extractSvgProps(Warning)} dangerouslySetInnerHTML={{ __html: extractSvgContent(Warning) }} />

  // Ensures that if iconSet or the original icon doc is revalidated, the icon will be set as stale, but the page itself will not.
  const iconSet = await getCached('iconSet', draft)
  const svg = await getCached('icon', icon, draft, iconSet)

  return <svg {...pt?.c?.p} {...extractSvgProps(svg || Warning)} dangerouslySetInnerHTML={{ __html: extractSvgContent(svg || Warning) }} />
}
