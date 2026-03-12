'use client'
import { useMemo } from 'react'
import { useTheme } from 'next-themes'
import { ActionContext, FullFormContext } from '@/ts/types'
import { useAtomicStore } from '@/hooks/frontEnd/atomicStore'
import { useFormContext } from '@/components/providers/formProvider'

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
