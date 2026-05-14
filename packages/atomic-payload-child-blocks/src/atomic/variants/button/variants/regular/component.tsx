'use server'
import type { RenderChild } from '@pro-laico/atomic-payload-types'
import type { AtomicChild } from '@pro-laico/atomic-payload-types/schema'

export const AtomicButtonRegular: React.FC<RenderChild<AtomicChild>> = async ({ block, pt, triggerChildren }) => {
  return (
    <button type="button" {...pt?.t?.p} {...pt?.t?.da}>
      {triggerChildren}
      {block?.screenReaderText && <span className="sr-only">{block?.screenReaderText}</span>}
    </button>
  )
}
