import { RenderChild } from 'atomic-payload/child-blocks-types'
import RichText from './component/index'
import type { RichTextChild as RichTextChildType } from 'atomic-payload/child-blocks-types'

export const RichTextChild: React.FC<RenderChild<RichTextChildType>> = ({ block: { richText }, pt }) => {
  return <div {...pt?.c?.p}>{richText && <RichText data={richText} />}</div>
}
