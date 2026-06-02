import { ClassNameField } from '@pro-laico/styles/fields/className'
import type { Block } from 'payload'

/**
 * Block **configs** only — no React, no `getCached`, no `server-only`. This file
 * is pulled into the Payload config graph (via the `pages` collection), so it
 * must stay free of client/server-component imports. The matching render
 * components live in `./components.tsx` and are imported only by the frontend.
 *
 * Every visual decision below is a `ClassNameField` (the styles plugin's
 * atomic-classes input) with a sensible default, not a hard-coded class in a
 * component. That's the back-to-front loop: the editor types classes here, the
 * page's `cssHook` collects them into `storedAtomicClasses`, the CSS processor
 * emits exactly those utilities/shortcuts, and the component applies whatever
 * the document holds.
 */

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    ClassNameField({ namePrefix: 'section', defaultValue: 'flex flex-col items-center text-center gap-5 py-20' }),
    ClassNameField({ namePrefix: 'eyebrow', defaultValue: 'text-sm font-medium text-brand-primary' }),
    ClassNameField({ namePrefix: 'heading', defaultValue: 'text-4xl font-bold tracking-tight text-foreground' }),
    ClassNameField({ namePrefix: 'subheading', defaultValue: 'text-lg text-muted-foreground' }),
    ClassNameField({ namePrefix: 'buttons', defaultValue: 'flex flex-wrap gap-3 justify-center mt-2' }),
    {
      name: 'buttons',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', defaultValue: '#' },
        ClassNameField({ namePrefix: 'button', defaultValue: 'trigger trigger-style-base trigger-size-lg' }),
      ],
    },
  ],
}

export const ButtonRowBlock: Block = {
  slug: 'buttonRow',
  interfaceName: 'ButtonRowBlock',
  labels: { singular: 'Button Row', plural: 'Button Rows' },
  fields: [
    { name: 'heading', type: 'text' },
    ClassNameField({ namePrefix: 'heading', defaultValue: 'text-sm font-medium text-muted-foreground mb-3' }),
    ClassNameField({ namePrefix: 'row', defaultValue: 'flex flex-wrap items-center gap-3' }),
    {
      name: 'buttons',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', defaultValue: '#' },
        ClassNameField({ namePrefix: 'button', defaultValue: 'trigger trigger-style-base trigger-size-base' }),
      ],
    },
  ],
}

export const CardGridBlock: Block = {
  slug: 'cardGrid',
  interfaceName: 'CardGridBlock',
  labels: { singular: 'Card Grid', plural: 'Card Grids' },
  fields: [
    { name: 'heading', type: 'text' },
    ClassNameField({ namePrefix: 'heading', defaultValue: 'text-2xl font-semibold tracking-tight text-foreground mb-4' }),
    ClassNameField({ namePrefix: 'grid', defaultValue: 'grid grid-cols-1 sm:grid-cols-3 gap-4' }),
    {
      name: 'cards',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        ClassNameField({ namePrefix: 'card', defaultValue: 'bg-card text-card-foreground border border-border rounded-lg p-6 flex flex-col gap-2' }),
        ClassNameField({ namePrefix: 'cardTitle', defaultValue: 'font-semibold' }),
        ClassNameField({ namePrefix: 'cardBody', defaultValue: 'text-sm text-muted-foreground' }),
      ],
    },
  ],
}

export const ProseBlock: Block = {
  slug: 'prose',
  interfaceName: 'ProseBlock',
  labels: { singular: 'Prose', plural: 'Prose' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'content', type: 'textarea', admin: { description: 'Plain text. Blank lines separate paragraphs.' } },
    ClassNameField({ namePrefix: 'prose', defaultValue: 'prose max-w-none' }),
  ],
}

export const PaletteBlock: Block = {
  slug: 'palette',
  interfaceName: 'PaletteBlock',
  labels: { singular: 'Color Palette', plural: 'Color Palettes' },
  fields: [
    { name: 'heading', type: 'text' },
    ClassNameField({ namePrefix: 'heading', defaultValue: 'text-2xl font-semibold tracking-tight text-foreground mb-4' }),
    ClassNameField({ namePrefix: 'grid', defaultValue: 'grid grid-cols-2 sm:grid-cols-4 gap-3' }),
    ClassNameField({ namePrefix: 'swatch', defaultValue: 'flex flex-col gap-2' }),
    ClassNameField({ namePrefix: 'swatchBox', defaultValue: 'h-16 w-full rounded-md border border-border' }),
    ClassNameField({ namePrefix: 'swatchLabel', defaultValue: 'text-xs text-muted-foreground' }),
  ],
}

/** Every example block, in the order they appear in the admin's block picker. */
export const exampleBlocks: Block[] = [HeroBlock, ButtonRowBlock, CardGridBlock, ProseBlock, PaletteBlock]

// ── Render-time data shapes (type-only; safe to import from components) ──

type Button = { id?: string | null; label?: string | null; href?: string | null; buttonClassName?: string | null }

export type HeroData = {
  blockType: 'hero'
  eyebrow?: string | null
  heading?: string | null
  subheading?: string | null
  sectionClassName?: string | null
  eyebrowClassName?: string | null
  headingClassName?: string | null
  subheadingClassName?: string | null
  buttonsClassName?: string | null
  buttons?: Button[] | null
}

export type ButtonRowData = {
  blockType: 'buttonRow'
  heading?: string | null
  headingClassName?: string | null
  rowClassName?: string | null
  buttons?: Button[] | null
}

export type CardGridData = {
  blockType: 'cardGrid'
  heading?: string | null
  headingClassName?: string | null
  gridClassName?: string | null
  cards?:
    | {
        id?: string | null
        title?: string | null
        body?: string | null
        cardClassName?: string | null
        cardTitleClassName?: string | null
        cardBodyClassName?: string | null
      }[]
    | null
}

export type ProseData = {
  blockType: 'prose'
  heading?: string | null
  content?: string | null
  proseClassName?: string | null
}

export type PaletteData = {
  blockType: 'palette'
  heading?: string | null
  headingClassName?: string | null
  gridClassName?: string | null
  swatchClassName?: string | null
  swatchBoxClassName?: string | null
  swatchLabelClassName?: string | null
}
