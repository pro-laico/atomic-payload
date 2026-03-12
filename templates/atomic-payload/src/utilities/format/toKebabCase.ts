/**
 * Configuration options for toKebabCase function.
 *
 * @options addQuotes, unicodeNormalization, camelCaseHandling, lowercase, dashCollapse, dashTrim
 */
export interface NameKebabOptions {
  /**
   * Add ' to beginning and end.
   *
   * @Default false
   */
  addQuotes?: boolean
  /**
   * Disable unicode normalization and diacritic removal
   *
   * @Default false
   */
  unicodeNormalization?: boolean
  /**
   * Disable camelCase/PascalCase boundary detection
   *
   * @Default false
   */
  camelCaseHandling?: boolean
  /**
   * Disable conversion to lowercase
   *
   * @Default false
   */
  lowercase?: boolean
  /**
   * Disable collapsing multiple dashes into single dash
   *
   * @Default false
   */
  dashCollapse?: boolean
  /**
   * Disable trimming dashes from start and end
   *
   * @Default false
   */
  dashTrim?: boolean
}

/**
 * Converts a string to kebab-case format by normalizing unicode characters, handling camelCase/PascalCase boundaries, and replacing non-alphanumeric characters with dashes.
 * Returns an empty string for null/undefined input or when the result would be empty.
 */
export function toKebabCase(input?: string | null, options: NameKebabOptions = {}): string {
  if (!input) return ''
  let s = input

  // 1. Unicode normalize and strip diacritics: "Crème" -> "Creme"
  if (options?.unicodeNormalization) s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')

  // 2. Handle camelCase / PascalCase / acronym boundaries:
  if (options?.camelCaseHandling) {
    s = s
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // fooBar -> foo-Bar
      .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, '$1-$2') // JSONData -> JSON-Data
  }

  // 3. Replace any run of non-alphanumeric characters with a dash
  s = s.replace(/[^A-Za-z0-9]+/g, '-')

  // 4. Lowercase
  if (options?.lowercase) s = s.toLowerCase()

  // 5. Collapse multiple dashes and trim edges
  if (options?.dashCollapse) s = s.replace(/-+/g, '-')

  // 6. Trim dashes from start and end
  if (options?.dashTrim) s = s.replace(/^-|-$/g, '')

  // 7. Add quotes if requested
  if (options?.addQuotes) s = `'${s}'`

  return s
}
