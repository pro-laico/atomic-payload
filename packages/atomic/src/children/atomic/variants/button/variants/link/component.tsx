'use server'
import type { RenderChild } from '@pro-laico/atomic/children'
import type { AtomicChild } from '@pro-laico/atomic/children/schema'
import NextLink from 'next/link'
export const AtomicButtonLink: React.FC<RenderChild<AtomicChild>> = async ({ block, pt, triggerChildren }) => {
  return (
    //@ts-expect-error href is already applied in the defaultProps
    <NextLink {...pt?.t?.p} {...pt?.t?.da}>
      {triggerChildren}
      {block?.screenReaderText && <span className="sr-only">{block?.screenReaderText}</span>}
    </NextLink>
  )
}
