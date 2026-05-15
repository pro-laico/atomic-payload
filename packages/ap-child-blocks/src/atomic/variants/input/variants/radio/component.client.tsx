'use client'
import type { RenderChild } from '@pro-laico/ap-child-blocks'
import type { AtomicChild } from '@pro-laico/ap-child-blocks/schema'
import { useActionContext } from '../../../../../hooks/useActions/useActionContext'
import { useToDa } from '../../../../../hooks/useActions/useToDa'

export const RadioInputClient: React.FC<RenderChild<AtomicChild>> = (props) => {
  const { pt, block } = props

  const context = useActionContext()
  const cda = useToDa({ attributers: block.contentActions?.attributers, context })

  return <input {...pt?.c?.p} {...pt?.c?.da} {...cda} />
}
