import { z } from '@/ts/zap'
import manualLogger from '@/utilities/log/manual'
import generatePreflights from './generatePreflights'
import { designSetColors } from '@/collections/designSets/tabs/colors'
import { TokenString, TokenStringArray } from '@/fields/designSets/value'
import type { DesignSet, TokenStorage, RSS, RSSOSA, UnoThemeAnimation, UnoColors as UnoColorsType } from '@/ts/types'

const processTokenString = z.function({ input: [z.ap.get('TokenString', TokenString)], output: z.ap.get('RSS') }).implement((input) => {
  if (!input) return {}
  const result = input.reduce<RSS>((acc, item) => {
    if (item.name && item.value) acc[item.name] = item.value
    return acc
  }, {})
  return result
})

const processTokenStringArray = z
  .function({ input: [z.ap.get('TokenStringArray', TokenStringArray)], output: z.ap.get('RSSOSA') })
  .implement((input) => {
    if (!input) return {}
    const result = input.reduce<RSSOSA>((acc, item) => {
      if (item.name && Array.isArray(item.values)) {
        const values = item.values.map((val) => val.value).filter((val): val is string => val !== undefined)
        acc[item.name] = values
      }
      return acc
    }, {})
    return result
  })

const processProperty = z.function({ input: [z.ap.get('TokenStringArray', TokenStringArray)], output: z.ap.get('RSS') }).implement((input) => {
  if (!input) return {}
  const result = input.reduce<RSS>((acc, item) => {
    if (item.name && Array.isArray(item.values)) {
      const values = item.values.map((val) => val.value).filter((val): val is string => val !== undefined)
      acc[item.name] = values.join(',')
    }
    return acc
  }, {})
  return result
})

function generateUnoFonts(fonts: DesignSet['font'] | undefined): RSS {
  if (!fonts) return {}
  return { mono: `var(--font-setMono)`, sans: `var(--font-setSans)`, serif: `var(--font-setSerif)`, display: `var(--font-setDisplay)` }
}

function generateUnoAnimation(input: DesignSet['animation'] | undefined): UnoThemeAnimation {
  if (!input) return {}
  return {
    category: input.reduce<RSS>((acc, i: { name?: string; category?: string | null }) => {
      if (i.name && i.category) acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.category
      return acc
    }, {}),
    keyframes: input.reduce<RSS>((acc, i: { name?: string; keyframes?: string | null }) => {
      if (i.name && i.keyframes) acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.keyframes
      return acc
    }, {}),
    durations: input.reduce<RSS>((acc, i: { name?: string; duration?: string | null }) => {
      if (i.name && i.duration) acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.duration
      return acc
    }, {}),
    timingFns: input.reduce<RSS>((acc, i: { name?: string; timingFns?: string | null }) => {
      if (i.name && i.timingFns) acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.timingFns
      return acc
    }, {}),
    counts: input.reduce<RSS>((acc, i: { name?: string; counts?: string | null }) => {
      if (i.name && i.counts) acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.counts
      return acc
    }, {}),
  }
}

const processColors = z.function({ input: [z.ap.get('DesignSetColors', designSetColors)], output: z.ap.get('UnoColors') }).implement((input) => {
  if (!input) return {}

  const o = input.reduce<UnoColorsType>((acc, color) => {
    if (!color) return acc
    acc[color.name] = `var(--${color.name})`
    return acc
  }, {})
  return o
})

function processAria(input: DesignSet['aria'] | undefined): RSS {
  if (!input) return {}

  return input.reduce<RSS>((acc, item) => {
    if (item.value) acc[item.value] = `${item.value}="${item.value}"`
    return acc
  }, {})
}

function processProseColor(input: DesignSet['proseColors'] | undefined): Record<string, [string, string]> {
  if (!input) return {}

  return Object.entries(input).reduce<Record<string, [string, string]>>((acc, [name, item]) => {
    acc[name] = [item.light, item.dark]
    return acc
  }, {})
}

function processProseTagStyles(input: NonNullable<DesignSet['proseStyles']>['default'] | undefined): Record<string, Record<string, string>> {
  if (!input) return {}

  return input.reduce<Record<string, Record<string, string>>>((acc, { tag, psuedoClass, values }) => {
    if (!values || !tag) return acc

    const fullTag = psuedoClass ? `${tag}${psuedoClass}` : tag

    acc[fullTag] ??= {}

    for (const { cssSelector, value } of values) acc[fullTag][cssSelector] = value

    return acc
  }, {})
}

const processDesignSet = (ds: DesignSet): void => {
  const tokenStorage: TokenStorage = {
    //Colors
    colors: processColors(ds.colors || []), //Custom

    //Variables
    variables: {
      spacing: ds.defaults?.spacing || '0.25rem',
      radius: ds.defaults?.radius || '0.625rem',
      ...processTokenString(ds?.variables),
    },

    //Animations
    ease: processTokenString(ds?.ease),
    animation: generateUnoAnimation(ds?.animation), //Custom
    property: processProperty(ds?.property), //Custom

    //Miscellaneous
    aria: processAria(ds?.aria),
    blur: processTokenString(ds?.blur),
    media: processTokenString(ds?.media),
    supports: processTokenString(ds?.supports),
    perspective: processTokenString(ds?.perspective),
    shadow: processTokenStringArray(ds?.shadow),
    textShadow: processTokenStringArray(ds?.textShadow),
    dropShadow: processTokenStringArray(ds?.dropShadow),
    insetShadow: processTokenStringArray(ds?.insetShadow),

    //Sizes
    radius: processTokenString(ds?.radius),
    spacing: processTokenString(ds?.spacing),
    container: processTokenString(ds?.container),
    breakpoint: processTokenString(ds?.breakpoint),

    // Fonts
    font: generateUnoFonts(ds?.font), //Custom
    leading: processTokenString(ds?.leading),
    tracking: processTokenString(ds?.tracking),
    fontWeight: processTokenString(ds?.fontWeight),
    textStrokeWidth: processTokenString(ds?.textStrokeWidth),
  }

  const preflightStorage = generatePreflights({ ds })
  ds.proseColorStorage = processProseColor(ds.proseColors)

  ds.proseDefaultStorage = processProseTagStyles(ds?.proseStyles?.default)
  ds.prosesmStorage = processProseTagStyles(ds?.proseStyles?.sm)
  ds.proseBaseStorage = processProseTagStyles(ds?.proseStyles?.base)
  ds.proselgStorage = processProseTagStyles(ds?.proseStyles?.lg)

  ds.tokenStorage = tokenStorage
  ds.preflightStorage = preflightStorage
  ds.updatedAt = new Date().toISOString()

  manualLogger(`[STORE] - Design Set - ${ds?.title}`)
}

export default processDesignSet
