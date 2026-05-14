'use client'
import type { RenderChild } from '@pro-laico/ap-types'
import type { AtomicChild } from '@pro-laico/ap-types/schema'
import { useActionContext } from '../../../../../hooks/useActions/useActionContext'
import { useToDa } from '../../../../../hooks/useActions/useToDa'

export const CheckboxInputClient: React.FC<RenderChild<AtomicChild>> = (props) => {
  const { pt, block } = props

  const context = useActionContext()
  const cda = useToDa({ attributers: block.contentActions?.attributers, context })

  return <input {...pt?.c?.p} {...pt?.c?.da} {...cda} />
}
