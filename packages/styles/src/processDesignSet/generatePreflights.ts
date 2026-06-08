import type { DesignSet } from '@pro-laico/styles/schema'

function generatePreflights({ ds }: { ds: DesignSet }): string {
  const minify = ds?.minify ?? true

  const variables = (ds?.variables || [])
    .map((variable: { name?: string; value?: string }) => `  --${variable?.name}: ${variable?.value};`)
    .join(minify ? '' : '\n')

  const defaults = minify ? `--radius: ${ds?.defaults?.radius || '0.625rem'};` : `  \n  --radius: ${ds?.defaults?.radius || '0.625rem'};\n  `

  const lightColors = (ds?.colors || [])
    .map((color: { name?: string; light?: string }) => `  --${color?.name}: ${color?.light};`)
    .join(minify ? '' : '\n')
  const darkColors = (ds?.colors || [])
    .map((color: { name?: string; dark?: string }) => `  --${color?.name}: ${color?.dark};`)
    .join(minify ? '' : '\n')

  let result: string

  if (minify) {
    result = `:root{${lightColors}${variables}${defaults}}.dark{${darkColors}}`
  } else {
    result = `:root {\n${lightColors}\n${variables}\n${defaults}\n}\n.dark {\n${darkColors}\n}\n`

    result = result
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .join('\n')
  }

  return result
}

export default generatePreflights
