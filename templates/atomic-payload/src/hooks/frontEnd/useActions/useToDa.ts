'use client'
import { useMemo } from 'react'
import { ActionContext, Attributers } from '@/ts/types'
import { handleAttributerActions } from '@/hooks/frontEnd/useActions/dispatch'

export type UseToDaProps = { attributers: Attributers | undefined; context: ActionContext }
export type DataAttributes = Record<string, string> | undefined

/** Generates Data Attributes Using Attributer Actions & Context */
export function useToDa({ attributers, context }: UseToDaProps): DataAttributes {
  return useMemo(() => handleAttributerActions({ actions: attributers, context }), [attributers, context])
}
