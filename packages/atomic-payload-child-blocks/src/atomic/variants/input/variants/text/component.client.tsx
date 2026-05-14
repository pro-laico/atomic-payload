'use client'
import type { RenderChild } from '@pro-laico/atomic-payload-types'
import type { AtomicChild } from '@pro-laico/atomic-payload-types/schema'
import { useActionContext } from '../../../../../hooks/useActions/useActionContext'
import { useToDa } from '../../../../../hooks/useActions/useToDa'

export const TextInputClient: React.FC<RenderChild<AtomicChild>> = ({ block, pt }) => {
  const Tag = block.inputType === 'textarea' ? 'textarea' : 'input'

  const context = useActionContext()
  const cda = useToDa({ attributers: block.contentActions?.attributers, context })

  return <Tag {...pt?.c?.p} {...pt?.c?.da} {...cda} />
}
