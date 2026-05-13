'use client'
import { useState, useEffect, startTransition } from 'react'
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
    const next = typeof storedOpen === 'boolean' ? storedOpen : defaultOpen
    startTransition(() => setOpen(next))
  }, [block.blockType, block.portalName, block.persisted, context, defaultOpen])

  const onOpenChange = async () => {
    await handleRunnerActions({ actions: block.triggerActions?.runners, context })
  }

  return { open, onOpenChange }
}
