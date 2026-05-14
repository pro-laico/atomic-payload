'use client'
import type { RenderChild } from '@pro-laico/atomic-payload-types'
import type { AtomicChild } from '@pro-laico/atomic-payload-types/schema'
import { useActionContext } from '../../../hooks/useActions/useActionContext'
import { useToDa } from '../../../hooks/useActions/useToDa'

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
