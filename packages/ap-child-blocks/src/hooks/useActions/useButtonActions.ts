'use client'
import type { ActionContext } from '@pro-laico/ap-actions'
import type { AtomicChild } from '@pro-laico/ap-child-blocks/schema'
import { handleRunnerActions } from './dispatch'

export type UseButtonActionsProps = { block: AtomicChild; context: ActionContext }

export type UseButtonActionsReturns = { onClick: () => void }

export function useButtonActions(props: UseButtonActionsProps): UseButtonActionsReturns {
  const { block, context } = props

  const onClick = async () => {
    await handleRunnerActions({ actions: block.triggerActions?.runners, context })
  }

  return { onClick }
}
