'use client'
import { AtomicChild, RenderChild } from '@/ts/types'
import { useActionContext, useToDa } from '@/hooks/frontEnd/useActions'

export const TextInputClient: React.FC<RenderChild<AtomicChild>> = ({ block, pt }) => {
  const Tag = block.inputType === 'textarea' ? 'textarea' : 'input'

  const context = useActionContext()
  const cda = useToDa({ attributers: block.contentActions?.attributers, context })

  return <Tag {...pt?.c?.p} {...pt?.c?.da} {...cda} />
}
