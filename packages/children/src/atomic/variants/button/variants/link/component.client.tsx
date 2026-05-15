'use client'
import React from 'react'
import NextLink from 'next/link'
import type { RenderChild } from '@pro-laico/children'
import type { AtomicChild } from '@pro-laico/children/schema'
import { useToDa } from '../../../../../hooks/useActions/useToDa'
import { useButtonActions } from '../../../../../hooks/useActions/useButtonActions'
import { useActionContext } from '../../../../../hooks/useActions/useActionContext'

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
