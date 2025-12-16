'use client'
import React from 'react'
import NextLink from 'next/link'
import { AtomicChild, RenderChild } from '@/ts/types'
import { useToDa, useButtonActions, useActionContext } from '@/hooks/frontEnd/useActions'

export const AtomicButtonLinkClient: React.FC<RenderChild<AtomicChild>> = (props) => {
  const { block, pt, triggerChildren } = props

  const context = useActionContext()
  const useButton = useButtonActions({ block, context })
  const tda = useToDa({ attributers: block.triggerActions?.attributers, context })

  return (
    //@ts-expect-error href is already applied in the defaultProps
    <NextLink {...useButton} {...pt?.t?.p} {...pt?.t?.da} {...tda}>
      {triggerChildren}
      {block?.screenReaderText && <span className="sr-only">{block?.screenReaderText}</span>}
    </NextLink>
  )
}
