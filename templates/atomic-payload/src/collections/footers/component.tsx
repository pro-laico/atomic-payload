'use server'
import { Footer as FooterType } from '@/ts/types'
import { RenderChildren } from '@/components/child/renderChildren'

export const Footer = async ({ footer }: { footer: FooterType }) => {
  if (!footer) return <footer>No Footer Found</footer>

  return (
    <footer className={footer?.ClassName || undefined}>
      <RenderChildren blocks={footer?.children} />
    </footer>
  )
}
