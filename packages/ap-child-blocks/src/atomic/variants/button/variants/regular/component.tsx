'use server'
import type { RenderChild } from '@pro-laico/ap-child-blocks'
import type { AtomicChild } from '@pro-laico/ap-child-blocks/schema'
export const AtomicButtonRegular: React.FC<RenderChild<AtomicChild>> = async ({ block, pt, triggerChildren }) => {
  return (
    <button type="button" {...pt?.t?.p} {...pt?.t?.da}>
      {triggerChildren}
      {block?.screenReaderText && <span className="sr-only">{block?.screenReaderText}</span>}
    </button>
  )
}
