'use client'
import { useState, useEffect } from 'react'
import { ActionContext, AtomicChild } from '@/ts/types'
import { handleRunnerActions } from '@/hooks/frontEnd/useActions/dispatch'

export type UsePortalActionsProps = {
  block: AtomicChild
  defaultOpen: boolean
  context: ActionContext
}

export type UsePortalActionsReturns = {
  open: boolean
  onOpenChange: () => void
}

export function usePortalActions(props: UsePortalActionsProps): UsePortalActionsReturns {
  const { block, defaultOpen, context } = props

  const [open, setOpen] = useState(false)

  useEffect(() => {
    const storedOpen = context.atomicStore.getValue(block.portalName!, block.persisted)
    if (typeof storedOpen === 'boolean') setOpen(storedOpen)
    else setOpen(defaultOpen)
  }, [block.blockType, block.portalName, block.persisted, context, defaultOpen])

  const onOpenChange = async () => {
    await handleRunnerActions({ actions: block.triggerActions?.runners, context })
  }

  return { open, onOpenChange }
}
