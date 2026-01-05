import { RenderChild } from '@/ts/types'
import RichText from '@/blocks/children/richText/component/index'
import type { RichTextChild as RichTextChildType } from '@/ts/types'

export const RichTextChild: React.FC<RenderChild<RichTextChildType>> = ({ block: { richText }, pt }) => {
  return <div {...pt?.c?.p}>{richText && <RichText data={richText} />}</div>
}
