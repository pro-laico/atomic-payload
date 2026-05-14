'use server'
import type { RenderChild } from '@pro-laico/atomic-payload-types'
import type { AtomicChild } from '@pro-laico/atomic-payload-types/schema'

export const TextInput: React.FC<RenderChild<AtomicChild>> = async ({ block, pt }) => {
  const Tag = block.inputType === 'textarea' ? 'textarea' : 'input'
  return <Tag {...pt?.c?.p} {...pt?.c?.da} />
}
