import type { RenderChild } from '@pro-laico/atomic-payload-types'
import RichText from './component/index'
import type { RichTextChild as RichTextChildType } from '@pro-laico/atomic-payload-types/schema'

export const RichTextChild: React.FC<RenderChild<RichTextChildType>> = ({ block: { richText }, pt }) => {
  return <div {...pt?.c?.p}>{richText && <RichText data={richText} />}</div>
}
