'use server'
import { AtomicChild, RenderChild } from 'atomic-payload/child-blocks-types'

export const AtomicButtonRegular: React.FC<RenderChild<AtomicChild>> = async ({ block, pt, triggerChildren }) => {
  return (
    <button type="button" {...pt?.t?.p} {...pt?.t?.da}>
      {triggerChildren}
      {block?.screenReaderText && <span className="sr-only">{block?.screenReaderText}</span>}
    </button>
  )
}
