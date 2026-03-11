'use client'
import { AtomicChild, RenderChild } from '@/ts/types'
import { useActionContext, useToDa } from '@/hooks/frontEnd/useActions'

export const AtomicTagClient: React.FC<RenderChild<AtomicChild>> = (props) => {
  const { block, pt, contentChildren } = props

  const context = useActionContext()
  const cda = useToDa({ attributers: block.contentActions?.attributers, context })

  if (block.tagType === 'fragment' || !block.tagType) return <>{contentChildren}</>
  return (
    <block.tagType {...pt?.c?.p} {...pt?.c?.da} {...cda}>
      {contentChildren}
    </block.tagType>
  )
}
