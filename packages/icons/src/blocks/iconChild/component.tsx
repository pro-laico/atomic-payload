import 'server-only'
import { draftMode } from 'next/headers'

import Warning from '@pro-laico/atomic/children/admin/warningIcon'
import { extractSvgContent, extractSvgProps } from '@pro-laico/icons'
import { getCachedIconByName, getCachedIconSet } from '../../cache'
import type { RenderChild } from '@pro-laico/atomic/children'
import type { IconChild as IconChildType } from '@pro-laico/atomic/children/schema'

export const IconChild: React.FC<RenderChild<IconChildType>> = async ({ block: { icon }, pt }) => {
  const { isEnabled: draft } = await draftMode()
  if (!icon) return <svg {...pt?.c?.p} {...extractSvgProps(Warning)} dangerouslySetInnerHTML={{ __html: extractSvgContent(Warning) }} />

  // Ensures that if iconSet or the original icon doc is revalidated, the icon will be set as stale, but the page itself will not.
  const iconSet = await getCachedIconSet(draft)
  const svg = await getCachedIconByName(icon, draft, iconSet)

  return <svg {...pt?.c?.p} {...extractSvgProps(svg || Warning)} dangerouslySetInnerHTML={{ __html: extractSvgContent(svg || Warning) }} />
}
