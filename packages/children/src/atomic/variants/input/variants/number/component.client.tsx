'use client'
import type { RenderChild } from '@pro-laico/children'
import type { AtomicChild } from '@pro-laico/children/schema'
import { useActionContext } from '../../../../../hooks/useActions/useActionContext'
import { useToDa } from '../../../../../hooks/useActions/useToDa'

export const NumberInputClient: React.FC<RenderChild<AtomicChild>> = (props) => {
  const { pt, block } = props

  const context = useActionContext()
  const cda = useToDa({ attributers: block.contentActions?.attributers, context })

  return <input {...pt?.c?.p} {...pt?.c?.da} {...cda} />
}
