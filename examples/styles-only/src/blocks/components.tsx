import getCached from '@/cache/getCached'

import type { ButtonRowData, CardGridData, HeroData, PaletteData, ProseData } from './configs'

/**
 * Render components for the example blocks. These are frontend-only (one reads
 * `getCached`, i.e. `server-only`), so they live apart from `./configs.ts` and
 * are never imported into the Payload config graph.
 *
 * None of them hard-code utility classes — they apply the `*ClassName` values
 * stored on the block. That is what makes the loop "back to front": whatever an
 * editor typed (and the cssHook compiled) is exactly what renders.
 */

export function Hero({ block }: { block: HeroData }) {
  return (
    <section className={block.sectionClassName || undefined}>
      {block.eyebrow ? <span className={block.eyebrowClassName || undefined}>{block.eyebrow}</span> : null}
      <h2 className={block.headingClassName || undefined}>{block.heading}</h2>
      {block.subheading ? <p className={block.subheadingClassName || undefined}>{block.subheading}</p> : null}
      {block.buttons?.length ? (
        <div className={block.buttonsClassName || undefined}>
          {block.buttons.map((b, i) => (
            <a key={b.id ?? i} href={b.href || '#'} className={b.buttonClassName || undefined}>
              {b.label}
            </a>
          ))}
        </div>
      ) : null}
    </section>
  )
}

export function ButtonRow({ block }: { block: ButtonRowData }) {
  return (
    <div>
      {block.heading ? <p className={block.headingClassName || undefined}>{block.heading}</p> : null}
      <div className={block.rowClassName || undefined}>
        {(block.buttons ?? []).map((b, i) => (
          <a key={b.id ?? i} href={b.href || '#'} className={b.buttonClassName || undefined}>
            {b.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export function CardGrid({ block }: { block: CardGridData }) {
  return (
    <div>
      {block.heading ? <h2 className={block.headingClassName || undefined}>{block.heading}</h2> : null}
      <div className={block.gridClassName || undefined}>
        {(block.cards ?? []).map((c, i) => (
          <div key={c.id ?? i} className={c.cardClassName || undefined}>
            <span className={c.cardTitleClassName || undefined}>{c.title}</span>
            {c.body ? <span className={c.cardBodyClassName || undefined}>{c.body}</span> : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Prose({ block }: { block: ProseData }) {
  const paragraphs = (block.content ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  return (
    <div className={block.proseClassName || undefined}>
      {block.heading ? <h3>{block.heading}</h3> : null}
      {paragraphs.map((p, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static seeded content
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}

type ColorRow = { name?: string | null }

/** Async — reads the active design set to paint a swatch per token. Shows the
 *  read side of the plugin: the document driving the CSS is also queryable data. */
export async function Palette({ block, draft }: { block: PaletteData; draft: boolean }) {
  const ds = (await getCached('designSet', draft)) as { colors?: ColorRow[] | null } | null
  const colors = ds?.colors ?? []
  return (
    <div>
      {block.heading ? <h2 className={block.headingClassName || undefined}>{block.heading}</h2> : null}
      <div className={block.gridClassName || undefined}>
        {colors.map((c) => (
          <div key={c.name ?? Math.random()} className={block.swatchClassName || undefined}>
            <div className={block.swatchBoxClassName || undefined} style={{ background: `var(--${c.name})` }} />
            <span className={block.swatchLabelClassName || undefined}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
