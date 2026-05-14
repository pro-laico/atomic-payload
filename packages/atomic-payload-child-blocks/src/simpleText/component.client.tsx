'use client'
import { useActionContext, useDaToText, useToDa } from 'atomic-payload/child-blocks-deps-client'
import type { SimpleTextChild as SimpleTextChildType, RenderChild } from 'atomic-payload/child-blocks-types'

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
