'use server'
import NextLink from 'next/link'
import type { RenderChild } from '@pro-laico/children'
import type { AtomicChild } from '@pro-laico/children/schema'
export const AtomicButtonLink: React.FC<RenderChild<AtomicChild>> = async ({ block, pt, triggerChildren }) => {
  return (
    //@ts-expect-error href is already applied in the defaultProps
    <NextLink {...pt?.t?.p} {...pt?.t?.da}>
      {triggerChildren}
      {block?.screenReaderText && <span className="sr-only">{block?.screenReaderText}</span>}
    </NextLink>
  )
}
