'use server'
import type { SimpleTextChild as SimpleTextChildType, RenderChild } from '@/ts/types'

export const SimpleTextChild: React.FC<RenderChild<SimpleTextChildType>> = async ({ block, pt }) => {
  if (block.tagType === 'fragment') return <>{block.text}</>
  return (
    <block.tagType {...pt?.c?.p} {...pt?.c?.da}>
      {block.text}
    </block.tagType>
  )
}
