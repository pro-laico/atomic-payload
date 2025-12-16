'use client'
import { ActionContext, AtomicChild } from '@/ts/types'
import { handleRunnerActions } from '@/hooks/frontEnd/useActions/dispatch'

export type UseButtonActionsProps = { block: AtomicChild; context: ActionContext }

export type UseButtonActionsReturns = { onClick: () => void }

export function useButtonActions(props: UseButtonActionsProps): UseButtonActionsReturns {
  const { block, context } = props

  const onClick = async () => {
    await handleRunnerActions({ actions: block.triggerActions?.runners, context })
  }

  return { onClick }
}
