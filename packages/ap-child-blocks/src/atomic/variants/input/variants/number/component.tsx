'use server'
import type { RenderChild } from '@pro-laico/ap-child-blocks'
import type { AtomicChild } from '@pro-laico/ap-child-blocks/schema'
export const NumberInput: React.FC<RenderChild<AtomicChild>> = async ({ pt }) => {
  return <input {...pt?.c?.p} {...pt?.c?.da} />
}
