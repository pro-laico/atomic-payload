'use server'
import type { RenderChild } from '@pro-laico/atomic/children'
import type { SimpleTextChild as SimpleTextChildType } from '@pro-laico/atomic/children/schema'
export const SimpleTextChild: React.FC<RenderChild<SimpleTextChildType>> = async ({ block, pt }) => {
  if (block.tagType === 'fragment') return <>{block.text}</>
  return (
    <block.tagType {...pt?.c?.p} {...pt?.c?.da}>
      {block.text}
    </block.tagType>
  )
}
