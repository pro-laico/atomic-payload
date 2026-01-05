import { RenderChild } from '@/ts/types'
import type { SVGChild as SVGChildType } from '@/ts/types'

export const SVGChild: React.FC<RenderChild<SVGChildType>> = ({ pt }) => {
  return <svg {...pt?.c?.p} {...pt?.c?.da} />
}
