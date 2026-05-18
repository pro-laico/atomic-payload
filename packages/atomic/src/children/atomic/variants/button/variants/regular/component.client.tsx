'use client'
import type { RenderChild } from '@pro-laico/atomic/children'
import type { AtomicChild } from '@pro-laico/atomic/children/schema'
import type React from 'react'
import { useActionContext } from '../../../../../hooks/useActions/useActionContext'
import { useButtonActions } from '../../../../../hooks/useActions/useButtonActions'
import { useToDa } from '../../../../../hooks/useActions/useToDa'

export const AtomicButtonRegularClient: React.FC<RenderChild<AtomicChild>> = (props) => {
  const { block, pt, triggerChildren } = props

  const context = useActionContext()
  const useButton = useButtonActions({ block, context })
  const tda = useToDa({ attributers: block.triggerActions?.attributers, context })

  return (
    <button type="button" {...useButton} {...pt?.t?.p} {...pt?.t?.da} {...tda}>
      {triggerChildren}
      {block?.screenReaderText && <span className="sr-only">{block?.screenReaderText}</span>}
    </button>
  )
}
