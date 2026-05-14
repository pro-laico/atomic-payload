'use client'
import React from 'react'
import { AtomicChild, RenderChild } from 'atomic-payload/child-blocks-types'
import { useToDa, useButtonActions, useActionContext } from 'atomic-payload/child-blocks-deps-client'

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
