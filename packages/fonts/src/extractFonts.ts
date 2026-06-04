/** The shape `next/font/local` produces for each declared font — only the
 *  generated `variable` (its CSS-variable class) is read here. */
type FontDefinitions = Record<string, { variable?: string } | undefined>

/**
 * Collect the `next/font/local` CSS-variable classes from a generated
 * `definition.ts` default export into a single space-separated string for the
 * root `<html>` `className`. Returns `undefined` when nothing has been
 * generated yet (e.g. before `generate:fonts` has run), so it drops straight
 * into `className`.
 *
 * @example
 * import definitionFonts from '@/app/definition'
 * import { extractFonts } from '@pro-laico/fonts'
 *
 * <html className={extractFonts(definitionFonts)}>
 */
export function extractFonts(definitionFonts: FontDefinitions): string | undefined {
  const variables = Object.values(definitionFonts)
    .map((font) => font?.variable)
    .filter(Boolean)
    .join(' ')
  return variables || undefined
}
