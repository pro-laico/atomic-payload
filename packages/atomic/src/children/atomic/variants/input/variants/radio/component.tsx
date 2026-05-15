'use server'
import type { RenderChild } from '@pro-laico/atomic/children'
import type { AtomicChild } from '@pro-laico/atomic/children/schema'
export const RadioInput: React.FC<RenderChild<AtomicChild>> = async ({ pt }) => {
  return <input {...pt?.c?.p} {...pt?.c?.da} />
}
