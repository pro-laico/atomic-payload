'use client'
import { AtomicChild, RenderChild } from '@/ts/types'
import { useActionContext, useToDa } from '@/hooks/frontEnd/useActions'

export const CheckboxInputClient: React.FC<RenderChild<AtomicChild>> = (props) => {
  const { pt, block } = props

  const context = useActionContext()
  const cda = useToDa({ attributers: block.contentActions?.attributers, context })

  return <input {...pt?.c?.p} {...pt?.c?.da} {...cda} />
}
