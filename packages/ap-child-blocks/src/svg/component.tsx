import type { RenderChild } from '@pro-laico/ap-child-blocks'
import type { SVGChild as SVGChildType } from '@pro-laico/ap-child-blocks/schema'
export const SVGChild: React.FC<RenderChild<SVGChildType>> = ({ pt }) => {
  return <svg {...pt?.c?.p} {...pt?.c?.da} />
}
