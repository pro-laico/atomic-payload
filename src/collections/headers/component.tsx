'use server'
import { Header as HeaderType } from '@/ts/types'
import { RenderChildren } from '@/components/child/renderChildren'

export const Header = async ({ header }: { header: HeaderType }) => {
  if (!header) return <header>No Header Found</header>

  return (
    <header className={header?.ClassName || undefined}>
      <RenderChildren blocks={header?.children} />
    </header>
  )
}
