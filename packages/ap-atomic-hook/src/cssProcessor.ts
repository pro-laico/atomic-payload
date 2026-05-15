import { deepMerge } from '@pro-laico/ap-apf'
import manualLogger from './utilities/manualLogger'
import type { CollectionsWithStoredAtomicClasses, cssProcessorType } from '@pro-laico/ap-atomic-hook'
import type { DesignSet } from '@pro-laico/ap-design-sets/schema'
import type { ShortcutSet } from '@pro-laico/ap-site/schema'
import { defaultAtomicClasses } from '@pro-laico/ap-design-sets/designSet/defaults'
import { createGenerator, PresetWind4Theme, presetWind4, presetAttributify, presetTypography } from 'unocss'
import type { AtomicHookGetCached } from './atomicHookTypes'
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

export function createCssProcessor(getCached: AtomicHookGetCached): cssProcessorType {
  return async ({ slug, context, draft, req }) => {
    const pagesAtomicClasses = (await getCached('atomic-classes', draft)) as string[] | undefined
    const header = (slug !== 'header' ? await getCached('header', draft) : context?.header) as CollectionsWithStoredAtomicClasses | undefined
    const footer = (slug !== 'footer' ? await getCached('footer', draft) : context?.footer) as CollectionsWithStoredAtomicClasses | undefined
    const ds = (slug !== 'designSet' ? await getCached('designSet', draft) : context?.designSet) as CssDocDesignSet | undefined
    const shortcutSet = (slug !== 'shortcutSet' ? await getCached('shortcutSet', draft) : context?.shortcutSet) as ShortcutSet | undefined

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
      slug: `${draft ? 'draft' : 'published'}Storage`,
      data: { layoutCSS: css, cssSize: css.length, updatedAt },
    })
    manualLogger(`[UPDATE] (Global) - ${draft ? 'Draft' : 'Published'} CSS Storage - ${css.length} bytes`)

    return css
  }
}
