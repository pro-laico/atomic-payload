import type { RenderChild } from '@pro-laico/atomic/children'
import type { RichTextChild as RichTextChildType } from '@pro-laico/atomic/children/schema'
import RichText from './component/index'
export const RichTextChild: React.FC<RenderChild<RichTextChildType>> = ({ block: { richText }, pt }) => {
  return <div {...pt?.c?.p}>{richText && <RichText data={richText} />}</div>
}
