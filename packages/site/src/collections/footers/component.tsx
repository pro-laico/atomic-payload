import 'server-only'
import { RenderChildren } from '@pro-laico/atomic/children/render'
import type { Footer as FooterType } from '@pro-laico/site/schema'

export const Footer = async ({ footer }: { footer: FooterType }) => {
  if (!footer) return <footer>No Footer Found</footer>

  return (
    <footer className={footer?.ClassName || undefined}>
      <RenderChildren blocks={footer?.children} />
    </footer>
  )
}
