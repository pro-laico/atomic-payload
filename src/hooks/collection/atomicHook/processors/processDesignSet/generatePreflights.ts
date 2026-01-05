import { DesignSet } from '@/ts/types'

function generatePreflights({ ds }: { ds: DesignSet }): string {
  const minify = ds?.minify ?? true

  const variables = (ds?.variables || []).map((variable) => `  --${variable?.name}: ${variable?.value};`).join(minify ? '' : '\n')

  const defaults = minify
    ? `--radius: ${ds?.defaults?.radius || '0.625rem'};`
    : `  
  --radius: ${ds?.defaults?.radius || '0.625rem'};
  `

  // Colors
  const lightColors = (ds?.colors || []).map((color) => `  --${color?.name}: ${color?.light};`).join(minify ? '' : '\n')
  const darkColors = (ds?.colors || []).map((color) => `  --${color?.name}: ${color?.dark};`).join(minify ? '' : '\n')

  let result: string

  if (minify) {
    result = `:root{${lightColors}${variables}${defaults}}.dark{${darkColors}}`
  } else {
    result = `:root {\n${lightColors}\n${variables}\n${defaults}\n}\n.dark {\n${darkColors}\n}\n`

    // Apply formatting for non-minified output
    result = result
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .join('\n')
  }

  return result
}

export default generatePreflights
