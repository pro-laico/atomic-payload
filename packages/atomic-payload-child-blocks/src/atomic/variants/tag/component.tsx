'use server'
import type { RenderChild } from '@pro-laico/atomic-payload-types'
import type { AtomicChild } from '@pro-laico/atomic-payload-types/schema'

export const AtomicTag: React.FC<RenderChild<AtomicChild>> = async (props) => {
  const { block, pt, contentChildren } = props

  if (block.tagType === 'fragment' || !block.tagType) return <>{contentChildren}</>
  return (
    <block.tagType {...pt?.c?.p} {...pt?.c?.da}>
      {contentChildren}
    </block.tagType>
  )
}
