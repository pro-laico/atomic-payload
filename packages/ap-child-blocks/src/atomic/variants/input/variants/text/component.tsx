'use server'
import type { RenderChild } from '@pro-laico/ap-child-blocks'
import type { AtomicChild } from '@pro-laico/ap-child-blocks/schema'
export const TextInput: React.FC<RenderChild<AtomicChild>> = async ({ block, pt }) => {
  const Tag = block.inputType === 'textarea' ? 'textarea' : 'input'
  return <Tag {...pt?.c?.p} {...pt?.c?.da} />
}
