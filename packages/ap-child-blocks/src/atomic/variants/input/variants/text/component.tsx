'use server'
import type { RenderChild } from '@pro-laico/ap-types'
import type { AtomicChild } from '@pro-laico/ap-types/schema'

export const TextInput: React.FC<RenderChild<AtomicChild>> = async ({ block, pt }) => {
  const Tag = block.inputType === 'textarea' ? 'textarea' : 'input'
  return <Tag {...pt?.c?.p} {...pt?.c?.da} />
}
