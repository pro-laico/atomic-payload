'use server'
import type { RenderChild } from '@pro-laico/children'
import type { AtomicChild } from '@pro-laico/children/schema'
export const NumberInput: React.FC<RenderChild<AtomicChild>> = async ({ pt }) => {
  return <input {...pt?.c?.p} {...pt?.c?.da} />
}
