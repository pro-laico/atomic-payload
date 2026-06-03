import type React from 'react'

import { ButtonRow, CardGrid, Hero, Palette, Prose } from './components'
import type { ButtonRowData, CardGridData, HeroData, PaletteData, ProseData } from './configs'

export type AnyBlock = (HeroData | ButtonRowData | CardGridData | ProseData | PaletteData) & { id?: string | null }

/**
 * Maps a stored block's `blockType` to its render component. The page renderer
 * walks the `layout` array and hands each block to the matching component — the
 * same pattern the full Atomic Payload framework uses, minus the children
 * runtime. `Palette` is async (it reads the design set), which RSC handles fine
 * inside the mapped array.
 */
export function RenderBlocks({ blocks, draft }: { blocks?: AnyBlock[] | null; draft: boolean }) {
  if (!blocks?.length) return null
  return (
    <>
      {
        blocks.map((block, i) => {
          const key = block.id ?? i
          switch (block.blockType) {
            case 'hero':
              return <Hero key={key} block={block} />
            case 'buttonRow':
              return <ButtonRow key={key} block={block} />
            case 'cardGrid':
              return <CardGrid key={key} block={block} />
            case 'prose':
              return <Prose key={key} block={block} />
            case 'palette':
              return <Palette key={key} block={block} draft={draft} />
            default:
              return null
          }
        }) as React.ReactNode
      }
    </>
  )
}
