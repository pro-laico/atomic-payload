'use client'
import type { ActionContext, FullFormContext } from '@pro-laico/atomic/actions'
import { useAtomicStore } from '@pro-laico/atomic/hook/client'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

import { useFormContext } from '../../components/providers/formProvider'

type useActionContextProps = {
  fullFormContext?: FullFormContext
}

export function useActionContext(props?: useActionContextProps): ActionContext {
  const theme = useTheme()
  const formContext = useFormContext()
  const atomicStore = useAtomicStore((state) => state)

  return useMemo(
    () => ({ theme, atomicStore, fullFormContext: props?.fullFormContext || { ...formContext } }),
    [theme, atomicStore, formContext, props?.fullFormContext],
  )
}
