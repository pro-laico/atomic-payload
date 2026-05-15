'use server'
import type { RenderChild } from '@pro-laico/children'
import type { AtomicChild } from '@pro-laico/children/schema'
export const TextInput: React.FC<RenderChild<AtomicChild>> = async ({ block, pt }) => {
  const Tag = block.inputType === 'textarea' ? 'textarea' : 'input'
  return <Tag {...pt?.c?.p} {...pt?.c?.da} />
}
