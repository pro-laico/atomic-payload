'use client'
import { AtomicChild, RenderChild } from 'atomic-payload/child-blocks-types'
import { useActionContext, useToDa } from 'atomic-payload/child-blocks-deps'

export const TextInputClient: React.FC<RenderChild<AtomicChild>> = ({ block, pt }) => {
  const Tag = block.inputType === 'textarea' ? 'textarea' : 'input'

  const context = useActionContext()
  const cda = useToDa({ attributers: block.contentActions?.attributers, context })

  return <Tag {...pt?.c?.p} {...pt?.c?.da} {...cda} />
}
