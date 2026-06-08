import type { RenderChild } from '@pro-laico/atomic/children'
import type { SVGChild as SVGChildType } from '@pro-laico/atomic/children/schema'
export const SVGChild: React.FC<RenderChild<SVGChildType>> = ({ pt }) => {
  return <svg {...pt?.c?.p} {...pt?.c?.da} />
}
