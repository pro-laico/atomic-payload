'use server'
import type { Header as HeaderType } from '@pro-laico/ap-types/schema'
import { RenderChildren } from '@pro-laico/ap-child-blocks/render'

export const Header = async ({ header }: { header: HeaderType }) => {
  if (!header) return <header>No Header Found</header>

  return (
    <header className={header?.ClassName || undefined}>
      <RenderChildren blocks={header?.children} />
    </header>
  )
}
