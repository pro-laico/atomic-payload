import { RenderChild } from 'atomic-payload/child-blocks-types'
import type { SVGChild as SVGChildType } from 'atomic-payload/child-blocks-types'

export const SVGChild: React.FC<RenderChild<SVGChildType>> = ({ pt }) => {
  return <svg {...pt?.c?.p} {...pt?.c?.da} />
}
