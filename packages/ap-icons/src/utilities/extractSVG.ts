export const extractSvgContent = (svgString: string): string => svgString.match(/<svg[^>]*>([\s\S]*)<\/svg>/i)?.[1] || svgString

export const extractSvgProps = (svgString: string): Record<string, string> => {
  const match = svgString.match(/<svg([^>]*)>/i)
  if (!match) return {}
  const props: Record<string, string> = {}
  for (const [, key, value] of match[1].matchAll(/(\w+)="([^"]*)"/g)) props[key] = value
  return props
}
