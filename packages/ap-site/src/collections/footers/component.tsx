'use server'
import type { Footer as FooterType } from '@pro-laico/ap-site/schema'
import { RenderChildren } from '@pro-laico/ap-child-blocks/render'

export const Footer = async ({ footer }: { footer: FooterType }) => {
  if (!footer) return <footer>No Footer Found</footer>

  return (
    <footer className={footer?.ClassName || undefined}>
      <RenderChildren blocks={footer?.children} />
    </footer>
  )
}
