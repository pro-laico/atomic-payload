'use client'
import { AtomicChild, RenderChild } from 'atomic-payload/child-blocks-types'
import { useActionContext, useToDa } from 'atomic-payload/child-blocks-deps'

export const NumberInputClient: React.FC<RenderChild<AtomicChild>> = (props) => {
  const { pt, block } = props

  const context = useActionContext()
  const cda = useToDa({ attributers: block.contentActions?.attributers, context })

  return <input {...pt?.c?.p} {...pt?.c?.da} {...cda} />
}
