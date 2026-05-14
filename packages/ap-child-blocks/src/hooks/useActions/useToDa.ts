'use client'
import { useMemo } from 'react'
import type { ActionContext } from '@pro-laico/ap-types'
import type { Attributers } from '@pro-laico/ap-types/schema'
import { handleAttributerActions } from './dispatch'

export type UseToDaProps = { attributers: Attributers | undefined; context: ActionContext }
export type DataAttributes = Record<string, string> | undefined

/** Generates Data Attributes Using Attributer Actions & Context */
export function useToDa({ attributers, context }: UseToDaProps): DataAttributes {
  return useMemo(() => handleAttributerActions({ actions: attributers, context }), [attributers, context])
}
