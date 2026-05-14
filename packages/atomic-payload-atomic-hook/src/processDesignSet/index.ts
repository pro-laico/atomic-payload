import manualLogger from '../utilities/manualLogger'
import generatePreflights from './generatePreflights'
import type { DesignSet } from '@pro-laico/atomic-payload-types/schema'

type RSS = Record<string, string>
type RSSOSA = Record<string, string | string[]>
type UnoColorsType = Record<string, string>

type UnoThemeAnimation = {
  category?: RSS
  keyframes?: RSS
  durations?: RSS
  timingFns?: RSS
  counts?: RSS
}

type TokenStorage = {
  colors: UnoColorsType
  variables: RSS & { spacing?: string; radius?: string }
  ease: RSS
  animation: UnoThemeAnimation
  property: RSS
  aria: RSS
  blur: RSS
  media: RSS
  supports: RSS
  perspective: RSS
  shadow: RSSOSA
  textShadow: RSSOSA
  dropShadow: RSSOSA
  insetShadow: RSSOSA
  radius: RSS
  spacing: RSS
  container: RSS
  breakpoint: RSS
  font: RSS
  leading: RSS
  tracking: RSS
  fontWeight: RSS
  textStrokeWidth: RSS
}

type TokenStringRow = { name?: string; value?: string }
type TokenStringArrayRow = { name?: string; values?: { value?: string }[] }

function processTokenString(input: TokenStringRow[] | null | undefined): RSS {
  if (!input) return {}
  return input.reduce<RSS>((acc, item) => {
    if (item.name && item.value) acc[item.name] = item.value
    return acc
  }, {})
}

function processTokenStringArray(input: TokenStringArrayRow[] | null | undefined): RSSOSA {
  if (!input) return {}
  return input.reduce<RSSOSA>((acc, item) => {
    if (item.name && Array.isArray(item.values)) {
      const values = item.values.map((val) => val.value).filter((val): val is string => val !== undefined)
      acc[item.name] = values
    }
    return acc
  }, {})
}

function processProperty(input: TokenStringArrayRow[] | null | undefined): RSS {
  if (!input) return {}
  return input.reduce<RSS>((acc, item) => {
    if (item.name && Array.isArray(item.values)) {
      const values = item.values.map((val) => val.value).filter((val): val is string => val !== undefined)
      acc[item.name] = values.join(',')
    }
    return acc
  }, {})
}

function generateUnoFonts(fonts: DesignSet['font'] | undefined): RSS {
  if (!fonts) return {}
  return { mono: `var(--font-setMono)`, sans: `var(--font-setSans)`, serif: `var(--font-setSerif)`, display: `var(--font-setDisplay)` }
}

type AnimationRow = {
  name?: string
  category?: string | null
  keyframes?: string | null
  duration?: string | null
  timingFns?: string | null
  counts?: string | null
}

function generateUnoAnimation(input: AnimationRow[] | null | undefined): UnoThemeAnimation {
  if (!input) return {}
  return {
    category: input.reduce<RSS>((acc, i) => {
      if (i.name && i.category) acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.category
      return acc
    }, {}),
    keyframes: input.reduce<RSS>((acc, i) => {
      if (i.name && i.keyframes) acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.keyframes
      return acc
    }, {}),
    durations: input.reduce<RSS>((acc, i) => {
      if (i.name && i.duration) acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.duration
      return acc
    }, {}),
    timingFns: input.reduce<RSS>((acc, i) => {
      if (i.name && i.timingFns) acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.timingFns
      return acc
    }, {}),
    counts: input.reduce<RSS>((acc, i) => {
      if (i.name && i.counts) acc[i.name.toLowerCase().replace(/\s+/g, '-')] = i.counts
      return acc
    }, {}),
  }
}

type DesignSetColor = { name?: string }

function processColors(input: DesignSetColor[] | null | undefined): UnoColorsType {
  if (!input) return {}
  return input.reduce<UnoColorsType>((acc, color) => {
    if (!color?.name) return acc
    acc[color.name] = `var(--${color.name})`
    return acc
  }, {})
}

type AriaRow = { value?: string }

function processAria(input: AriaRow[] | null | undefined): RSS {
  if (!input) return {}

  return input.reduce<RSS>((acc, item) => {
    if (item.value) acc[item.value] = `${item.value}="${item.value}"`
    return acc
  }, {})
}

type ProseColorEntry = { light: string; dark: string }

function processProseColor(input: Record<string, ProseColorEntry> | null | undefined): Record<string, [string, string]> {
  if (!input) return {}

  return Object.entries(input).reduce<Record<string, [string, string]>>((acc, [name, item]) => {
    acc[name] = [item.light, item.dark]
    return acc
  }, {})
}

type ProseStyleRow = {
  tag?: string
  psuedoClass?: string
  values?: { cssSelector: string; value: string }[]
}

function processProseTagStyles(input: ProseStyleRow[] | null | undefined): Record<string, Record<string, string>> {
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
  const animationRows = (ds?.animation ?? null) as AnimationRow[] | null | undefined

  const tokenStorage: TokenStorage = {
    colors: processColors(ds.colors || []),

    variables: {
      spacing: ds.defaults?.spacing || '0.25rem',
      radius: ds.defaults?.radius || '0.625rem',
      ...processTokenString(ds?.variables as TokenStringRow[] | null | undefined),
    },

    ease: processTokenString(ds?.ease as TokenStringRow[] | null | undefined),
    animation: generateUnoAnimation(animationRows),
    property: processProperty(ds?.property as TokenStringArrayRow[] | null | undefined),

    aria: processAria(ds?.aria as AriaRow[] | null | undefined),
    blur: processTokenString(ds?.blur as TokenStringRow[] | null | undefined),
    media: processTokenString(ds?.media as TokenStringRow[] | null | undefined),
    supports: processTokenString(ds?.supports as TokenStringRow[] | null | undefined),
    perspective: processTokenString(ds?.perspective as TokenStringRow[] | null | undefined),
    shadow: processTokenStringArray(ds?.shadow as TokenStringArrayRow[] | null | undefined),
    textShadow: processTokenStringArray(ds?.textShadow as TokenStringArrayRow[] | null | undefined),
    dropShadow: processTokenStringArray(ds?.dropShadow as TokenStringArrayRow[] | null | undefined),
    insetShadow: processTokenStringArray(ds?.insetShadow as TokenStringArrayRow[] | null | undefined),

    radius: processTokenString(ds?.radius as TokenStringRow[] | null | undefined),
    spacing: processTokenString(ds?.spacing as TokenStringRow[] | null | undefined),
    container: processTokenString(ds?.container as TokenStringRow[] | null | undefined),
    breakpoint: processTokenString(ds?.breakpoint as TokenStringRow[] | null | undefined),

    font: generateUnoFonts(ds?.font),
    leading: processTokenString(ds?.leading as TokenStringRow[] | null | undefined),
    tracking: processTokenString(ds?.tracking as TokenStringRow[] | null | undefined),
    fontWeight: processTokenString(ds?.fontWeight as TokenStringRow[] | null | undefined),
    textStrokeWidth: processTokenString(ds?.textStrokeWidth as TokenStringRow[] | null | undefined),
  }

  const preflightStorage = generatePreflights({ ds })
  ds.proseColorStorage = processProseColor(ds.proseColors as Record<string, ProseColorEntry> | null | undefined)

  const proseStyles = ds?.proseStyles as { sm?: ProseStyleRow[]; base?: ProseStyleRow[]; default?: ProseStyleRow[]; lg?: ProseStyleRow[] } | null | undefined
  ds.proseDefaultStorage = processProseTagStyles(proseStyles?.default)
  ds.prosesmStorage = processProseTagStyles(proseStyles?.sm)
  ds.proseBaseStorage = processProseTagStyles(proseStyles?.base)
  ds.proselgStorage = processProseTagStyles(proseStyles?.lg)

  ds.tokenStorage = tokenStorage as DesignSet['tokenStorage']
  ds.preflightStorage = preflightStorage
  ds.updatedAt = new Date().toISOString()

  manualLogger(`[STORE] - Design Set - ${ds?.title}`)
}

export default processDesignSet
