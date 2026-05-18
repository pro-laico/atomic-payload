'use server'
import { RenderChildren } from '@pro-laico/atomic/children/render'
import type { Header as HeaderType } from '@pro-laico/site/schema'

export const Header = async ({ header }: { header: HeaderType }) => {
  if (!header) return <header>No Header Found</header>

  return (
    <header className={header?.ClassName || undefined}>
      <RenderChildren blocks={header?.children} />
    </header>
  )
}
