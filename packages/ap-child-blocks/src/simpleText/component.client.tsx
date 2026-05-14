'use client'
import { useActionContext } from '../hooks/useActions/useActionContext'
import { useDaToText } from '../hooks/useActions/useDaToText'
import { useToDa } from '../hooks/useActions/useToDa'
import type { RenderChild } from '@pro-laico/ap-types'
import type { SimpleTextChild as SimpleTextChildType } from '@pro-laico/ap-types/schema'

export const SimpleTextChildClient: React.FC<RenderChild<SimpleTextChildType>> = (props) => {
  const { block, pt } = props

  const context = useActionContext()
  const cda = useToDa({ attributers: block.contentActions?.attributers, context })
  const stt = useDaToText({ text: block.text, sda: cda, ssrda: pt?.c?.da })

  if (block.tagType === 'fragment') return <>{stt}</>
  return (
    <block.tagType {...pt?.c?.p} {...pt?.c?.da} {...cda}>
      {stt}
    </block.tagType>
  )
}
