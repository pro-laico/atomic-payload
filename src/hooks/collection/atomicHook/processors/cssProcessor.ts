import deepMerge from '@/utilities/deepMerge'
import getCached from '@/utilities/get/cache/react'
import manualLogger from '@/utilities/log/manual'
import type { cssProcessorType } from '@/ts/types'
import { defaultAtomicClasses } from '@/collections/designSets/defaults'
import { createGenerator, PresetWind4Theme, presetWind4, presetAttributify, presetTypography } from 'unocss'

export const cssProcessor: cssProcessorType = async ({ slug, context, draft, req }) => {
  const pagesAtomicClasses = await getCached('atomic-classes', draft)
  const header = slug !== 'header' ? await getCached('header', draft) : context?.header
  const footer = slug !== 'footer' ? await getCached('footer', draft) : context?.footer
  const ds = slug !== 'designSet' ? await getCached('designSet', draft) : context?.designSet
  const shortcutSet = slug !== 'shortcutSet' ? await getCached('shortcutSet', draft) : context?.shortcutSet

  // Classes contained within unoShortcuts are automatically added to the classNames set, but in createGenerator.
  const shortcuts = [...(shortcutSet?.shortcuts || []), ...(shortcutSet?.defaultShortcuts || [])].reduce((acc: Record<string, string>, shortcut) => {
    if (shortcut.ClassName) acc[shortcut.name] = shortcut.ClassName
    return acc
  }, {})

  const classNames: Set<string> = new Set([
    ...(pagesAtomicClasses || []),
    ...(defaultAtomicClasses || []),
    ...(header?.storedAtomicClasses || []),
    ...(footer?.storedAtomicClasses || []),
    ...(context?.storedAtomicClasses || []),
    ...[...(ds?.htmlClassName?.split(' ') || [])],
    ...[...(ds?.bodyClassName?.split(' ') || [])],
    ...[...(ds?.wrapperClassName?.split(' ') || [])],
  ])

  const defaultClasses = { spacing: { DEFAULT: ds?.tokenStorage?.variables?.spacing || '0.25rem' } }

  const uno = await createGenerator({
    shortcuts,
    preflights: [{ getCSS: () => `${ds?.preflightStorage || ''}` }],
    presets: [presetWind4(), presetAttributify(), presetTypography()],
    extendTheme: (theme: PresetWind4Theme) => deepMerge(theme, deepMerge(ds?.tokenStorage, defaultClasses)),
  })

  const updatedAt = new Date().toISOString()
  const { css } = await uno.generate(Array.from(classNames), { minify: ds?.minify })

  await req.payload.updateGlobal({ req, slug: `${draft ? 'draft' : 'published'}Storage`, data: { layoutCSS: css, cssSize: css.length, updatedAt } })
  manualLogger(`[UPDATE] (Global) - ${draft ? 'Draft' : 'Published'} CSS Storage - ${css.length} bytes`)

  return css
}
