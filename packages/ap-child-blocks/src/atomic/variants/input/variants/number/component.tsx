'use server'
import type { RenderChild } from '@pro-laico/ap-types'
import type { AtomicChild } from '@pro-laico/ap-types/schema'

export const NumberInput: React.FC<RenderChild<AtomicChild>> = async ({ pt }) => {
  return <input {...pt?.c?.p} {...pt?.c?.da} />
}
