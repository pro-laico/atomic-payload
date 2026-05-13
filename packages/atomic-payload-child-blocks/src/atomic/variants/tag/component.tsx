'use server'
import { AtomicChild, RenderChild } from 'atomic-payload/child-blocks-types'

export const AtomicTag: React.FC<RenderChild<AtomicChild>> = async (props) => {
  const { block, pt, contentChildren } = props

  if (block.tagType === 'fragment' || !block.tagType) return <>{contentChildren}</>
  return (
    <block.tagType {...pt?.c?.p} {...pt?.c?.da}>
      {contentChildren}
    </block.tagType>
  )
}
