import { deepMerge } from '@pro-laico/core'
import type { ShortcutSet } from '@pro-laico/site/schema'
import { createGenerator, type PresetWind4Theme, presetAttributify, presetTypography, presetWind4 } from 'unocss'
import { defaultAtomicClasses } from './designSet/defaults'
import type { DesignSet } from './types/payload-augment'
import type { CollectionsWithStoredAtomicClasses, cssProcessorType } from './types/css'
import manualLogger from './utilities/manualLogger'

/** Narrow getter the CSS processor uses (e.g. app `getCached` / `unstable_cache` wrapper). */
export type CssProcessorGetCached = (tag: string, draft: boolean) => Promise<unknown>

type CssDocDesignSet = DesignSet & {
  tokenStorage?: (PresetWind4Theme & Record<string, unknown>) & {
    variables?: { spacing?: string }
  }
  preflightStorage?: string
  proseColorStorage?: Record<string, [string, string]>
  proseDefaultStorage?: Record<string, Record<string, string>>
  prosesmStorage?: Record<string, Record<string, string>>
  proseBaseStorage?: Record<string, Record<string, string>>
  proselgStorage?: Record<string, Record<string, string>>
  htmlClassName?: string
  bodyClassName?: string
  wrapperClassName?: string
  minify?: boolean
}

export type CssProcessorOptions = {
  /** Map of slug → cached-tag key used by `getCached`. Keys must include `header`, `footer`, `designSet`, `shortcutSet`. */
  cssCacheTagBySlug: Record<string, string>
  /** Global slugs that the generated CSS is written to. */
  cssStorageGlobals: { draft: string; published: string }
}

export function createCssProcessor(getCached: CssProcessorGetCached, options: CssProcessorOptions): cssProcessorType {
  const { cssCacheTagBySlug, cssStorageGlobals } = options
  const headerSlug = cssCacheTagBySlug.header ?? 'header'
  const footerSlug = cssCacheTagBySlug.footer ?? 'footer'
  const designSetSlug = cssCacheTagBySlug.designSet ?? 'designSet'
  const shortcutSetSlug = cssCacheTagBySlug.shortcutSet ?? 'shortcutSet'

  return async ({ slug, context, draft, req }) => {
    const pagesAtomicClasses = (await getCached('atomic-classes', draft)) as string[] | undefined
    const header = (slug !== headerSlug ? await getCached(headerSlug, draft) : context?.header) as CollectionsWithStoredAtomicClasses | undefined
    const footer = (slug !== footerSlug ? await getCached(footerSlug, draft) : context?.footer) as CollectionsWithStoredAtomicClasses | undefined
    const ds = (slug !== designSetSlug ? await getCached(designSetSlug, draft) : context?.designSet) as CssDocDesignSet | undefined
    const shortcutSet = (slug !== shortcutSetSlug ? await getCached(shortcutSetSlug, draft) : context?.shortcutSet) as ShortcutSet | undefined

    const shortcuts = [...(shortcutSet?.shortcuts || []), ...(shortcutSet?.defaultShortcuts || [])].reduce(
      (acc: Record<string, string>, shortcut) => {
        if ('ClassName' in shortcut && shortcut.ClassName) acc[String(shortcut.name)] = String(shortcut.ClassName)
        return acc
      },
      {},
    )

    const classNames: Set<string> = new Set([
      ...(pagesAtomicClasses || []),
      ...(defaultAtomicClasses || []),
      ...((header as { storedAtomicClasses?: string[] } | undefined)?.storedAtomicClasses || []),
      ...((footer as { storedAtomicClasses?: string[] } | undefined)?.storedAtomicClasses || []),
      ...((context?.storedAtomicClasses as string[] | undefined) || []),
      ...[...(ds?.htmlClassName?.split(' ') || [])],
      ...[...(ds?.bodyClassName?.split(' ') || [])],
      ...[...(ds?.wrapperClassName?.split(' ') || [])],
    ])

    const defaultClasses = { spacing: { DEFAULT: ds?.tokenStorage?.variables?.spacing || '0.25rem' } }

    const uno = await createGenerator({
      shortcuts,
      preflights: [{ getCSS: () => `${ds?.preflightStorage || ''}` }],
      presets: [
        presetWind4(),
        presetAttributify(),
        presetTypography({
          colorScheme: ds?.proseColorStorage,
          cssExtend: ds?.proseDefaultStorage,
          sizeScheme: {
            sm: ds?.prosesmStorage || {},
            base: ds?.proseBaseStorage || {},
            lg: ds?.proselgStorage || {},
          },
        }),
      ],
      extendTheme: (theme: PresetWind4Theme) => deepMerge(theme, deepMerge(ds?.tokenStorage, defaultClasses)),
    })

    const updatedAt = new Date().toISOString()
    const { css } = await uno.generate(Array.from(classNames), { minify: ds?.minify })

    await req.payload.updateGlobal({
      req,
      slug: draft ? cssStorageGlobals.draft : cssStorageGlobals.published,
      data: { layoutCSS: css, cssSize: css.length, updatedAt },
    } as unknown as Parameters<typeof req.payload.updateGlobal>[0])
    manualLogger(`[UPDATE] (Global) - ${draft ? 'Draft' : 'Published'} CSS Storage - ${css.length} bytes`)

    return css
  }
}
