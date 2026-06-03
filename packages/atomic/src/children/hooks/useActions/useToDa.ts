'use client'
import type { ActionContext } from '@pro-laico/atomic/actions'
import type { Attributers } from '@pro-laico/atomic/actions/schema'

import { useMemo } from 'react'

import { handleAttributerActions } from './dispatch'

export type UseToDaProps = { attributers: Attributers | undefined; context: ActionContext }
export type DataAttributes = Record<string, string> | undefined

/** Generates Data Attributes Using Attributer Actions & Context */
export function useToDa({ attributers, context }: UseToDaProps): DataAttributes {
  return useMemo(() => handleAttributerActions({ actions: attributers, context }), [attributers, context])
}
