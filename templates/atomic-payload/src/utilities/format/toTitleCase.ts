/**
 * Converts various text formats to Title Case by normalizing unicode characters,
 * handling different case boundaries, and properly capitalizing words.
 * Returns an empty string for null/undefined input or when the result would be empty.
 */
export function toTitleCase(input?: string | null): string {
  if (!input) return ''

  // 1. Unicode normalize and strip diacritics: "Crème" -> "Creme"
  let s = input.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')

  // 2. Handle different case boundaries and separators:
  s = s
    // Handle camelCase / PascalCase boundaries
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // fooBar -> foo Bar
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, '$1 $2') // JSONData -> JSON Data

    // Handle kebab-case and snake_case
    .replace(/[-_]+/g, ' ') // Replace dashes and underscores with spaces

    // Handle other separators (dots, colons, etc.)
    .replace(/[.\s]+/g, ' ') // Replace dots and multiple spaces with single space

  // 3. Split into words and capitalize each word
  const words = s.split(/\s+/).filter((word) => word.length > 0)

  if (words.length === 0) return ''

  // 4. Capitalize each word properly
  const titleCaseWords = words.map((word) => {
    // Handle acronyms (all caps words)
    if (/^[A-Z]+$/.test(word)) {
      return word // Keep acronyms as-is
    }

    // Handle mixed case words (like "iPhone", "McDonald")
    if (/^[A-Z][a-z]+$/.test(word)) {
      return word // Already properly capitalized
    }

    // Handle words that start with lowercase
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  })

  // 5. Join words with spaces and trim
  return titleCaseWords.join(' ').trim()
}
