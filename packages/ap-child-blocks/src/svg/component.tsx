import type { RenderChild } from '@pro-laico/ap-types'
import type { SVGChild as SVGChildType } from '@pro-laico/ap-types/schema'

export const SVGChild: React.FC<RenderChild<SVGChildType>> = ({ pt }) => {
  return <svg {...pt?.c?.p} {...pt?.c?.da} />
}
