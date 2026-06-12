/**
 * Pure, dependency-free extraction of literal icon names from one source file's
 * text. This is the core of the build-time usage scan that powers the admin
 * "requested icons" panel — kept side-effect-free (no `fs`) so it is trivially
 * unit-testable and reusable from any walker.
 *
 * It is tag-aware, NOT a naive regex. The scanner walks the file skipping
 * strings and comments, and for every `<Icon …>` opening tag it parses the
 * attribute list, so a `>` inside an expression (`check={a > b}`) or a `name`
 * substring inside a sibling attribute (`iconName`, `data-name`) never trips
 * it.
 *
 * ONLY string-literal names are collected — the value must resolve statically:
 *   - `name="x"` / `name='x'`            (direct attribute strings)
 *   - `name={"x"}` / `name={'x'}`        (string literal in an expression slot)
 *   - `` name={`x`} ``                   (template literal, no interpolation)
 * Dynamic `name={expr}` (variables, concatenation, interpolated templates) is
 * intentionally skipped — a static scan cannot know its value.
 */

/** A single literal `<Icon name="…">` occurrence found in a file. */
export interface ExtractedUsage {
  /** The resolved literal icon name. */
  name: string
  /** 1-based line of the `name` value. */
  line: number
  /** 1-based column of the `name` value. */
  column: number
}

export interface ExtractOptions {
  /**
   * JSX tag names treated as icon usages. Matched exactly against the opening
   * tag name, so `Icon` matches `<Icon …>` but not `<MyIcon …>`.
   *
   * @default ['Icon']
   */
  components?: string[]
}

const DEFAULT_COMPONENTS = ['Icon']

const isWhitespace = (c: string): boolean => c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f' || c === '\v'
const isIdentStart = (c: string): boolean => /[A-Za-z_$]/.test(c)
const isTagNameBoundary = (c: string | undefined): boolean => c === undefined || isWhitespace(c) || c === '/' || c === '>'

/** Builds a binary-searchable index of line-start offsets for fast line/column lookup. */
const buildLineIndex = (source: string): number[] => {
  const starts = [0]
  for (let i = 0; i < source.length; i++) if (source[i] === '\n') starts.push(i + 1)
  return starts
}

const lineColAt = (lineStarts: number[], index: number): { line: number; column: number } => {
  // Binary search for the greatest line-start <= index.
  let lo = 0
  let hi = lineStarts.length - 1
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1
    if (lineStarts[mid] <= index) lo = mid
    else hi = mid - 1
  }
  return { line: lo + 1, column: index - lineStarts[lo] + 1 }
}

/** Skips a `"…"` / `'…'` string starting at `i` (the opening quote). Returns the index just past the closing quote. */
const skipString = (source: string, i: number): number => {
  const quote = source[i]
  i++
  while (i < source.length) {
    const c = source[i]
    if (c === '\\') {
      i += 2
      continue
    }
    if (c === quote) return i + 1
    i++
  }
  return i
}

/** Skips a `` `…` `` template (including nested `${ … }`) starting at the opening backtick. Returns the index just past the closing backtick. */
const skipTemplate = (source: string, i: number): number => {
  i++
  while (i < source.length) {
    const c = source[i]
    if (c === '\\') {
      i += 2
      continue
    }
    if (c === '`') return i + 1
    if (c === '$' && source[i + 1] === '{') {
      i = skipBraces(source, i + 1)
      continue
    }
    i++
  }
  return i
}

/** Skips a balanced `{ … }` region starting at the opening brace, honoring nested braces, strings, templates, and comments. Returns the index just past the closing brace. */
const skipBraces = (source: string, i: number): number => {
  let depth = 0
  while (i < source.length) {
    const c = source[i]
    if (c === '"' || c === "'") {
      i = skipString(source, i)
      continue
    }
    if (c === '`') {
      i = skipTemplate(source, i)
      continue
    }
    if (c === '/' && source[i + 1] === '/') {
      i = skipLineComment(source, i)
      continue
    }
    if (c === '/' && source[i + 1] === '*') {
      i = skipBlockComment(source, i)
      continue
    }
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return i + 1
    }
    i++
  }
  return i
}

const skipLineComment = (source: string, i: number): number => {
  i += 2
  while (i < source.length && source[i] !== '\n') i++
  return i
}

const skipBlockComment = (source: string, i: number): number => {
  i += 2
  while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i++
  return Math.min(i + 2, source.length)
}

/**
 * Interprets a JSX attribute expression container's INNER text (the part
 * between `{` and `}`). Returns the literal string if the whole expression is a
 * single string or non-interpolated template literal, otherwise `null`
 * (dynamic — skipped).
 */
const interpretExpression = (inner: string): string | null => {
  const expr = inner.trim()
  if (expr.length < 2) return null
  const first = expr[0]
  const last = expr[expr.length - 1]
  if ((first === '"' || first === "'") && last === first) {
    // Must be a SINGLE string literal — reject concatenation like `"a" + b`.
    if (skipString(expr, 0) !== expr.length) return null
    return unquote(expr)
  }
  if (first === '`' && last === '`') {
    if (skipTemplate(expr, 0) !== expr.length) return null
    if (expr.includes('${')) return null // interpolated — dynamic
    return expr.slice(1, -1)
  }
  return null
}

/** Decodes a quoted string literal's escapes into its runtime value. */
const unquote = (literal: string): string => {
  const body = literal.slice(1, -1)
  return body.replace(/\\(.)/g, (_, ch: string) => {
    switch (ch) {
      case 'n':
        return '\n'
      case 't':
        return '\t'
      case 'r':
        return '\r'
      default:
        return ch
    }
  })
}

/**
 * Parses the attribute list of an `<Icon …>` opening tag and, if a literal
 * `name` is present, returns it with the absolute source index of its value.
 *
 * @param source full file text
 * @param start index of the first attribute char (just past the tag name)
 * @returns the literal name + value index, or `null` if absent/dynamic
 */
const parseNameAttr = (source: string, start: number): { name: string; index: number } | null => {
  let i = start
  while (i < source.length) {
    const c = source[i]
    if (isWhitespace(c)) {
      i++
      continue
    }
    if (c === '>') return null // end of opening tag, no name found
    if (c === '/' && source[i + 1] === '>') return null // self-closing, no name
    if (c === '{') {
      // Spread attribute `{...props}` — skip it wholesale.
      i = skipBraces(source, i)
      continue
    }
    if (!isIdentStart(c) && c !== '-') {
      i++
      continue
    }
    // Read an attribute name.
    const attrStart = i
    while (i < source.length && /[\w:-]/.test(source[i])) i++
    const attrName = source.slice(attrStart, i)
    // Skip whitespace before a possible `=`.
    let j = i
    while (j < source.length && isWhitespace(source[j])) j++
    if (source[j] !== '=') {
      // Boolean attribute (no value) — continue scanning from here.
      i = j
      continue
    }
    j++ // past '='
    while (j < source.length && isWhitespace(source[j])) j++
    const valChar = source[j]
    let valueIndex = j
    let value: string | null
    if (valChar === '"' || valChar === "'") {
      const end = skipString(source, j)
      value = unquote(source.slice(j, end))
      i = end
    } else if (valChar === '{') {
      const end = skipBraces(source, j)
      value = interpretExpression(source.slice(j + 1, end - 1))
      valueIndex = j + 1
      i = end
    } else {
      // Malformed/unexpected — bail on this tag.
      return null
    }
    if (attrName === 'name') {
      return value === null ? null : { name: value, index: valueIndex }
    }
  }
  return null
}

/**
 * Extracts every literal icon-name usage from a single file's source text.
 * See the module doc for what counts as a literal. Returns occurrences in
 * source order; de-duplication across files happens in the aggregator.
 *
 * The scan looks directly for `<Icon …>` tag starts and parses each opening tag
 * with full string/brace awareness (so the `name` value and the tag's end are
 * found correctly). It deliberately does NOT try to mask surrounding strings or
 * comments: JSX text routinely contains apostrophes (`it's`) and `//` (`http://`)
 * that a whole-file lexer would mis-read as a string/comment and skip a real
 * usage past. The cost is that an `<Icon name="…">` written literally inside a
 * JS string or comment may be picked up — a harmless over-count for an
 * inventory, where missing a real usage would be the worse failure.
 */
export const extractIconUsages = (source: string, options: ExtractOptions = {}): ExtractedUsage[] => {
  const components = options.components?.length ? options.components : DEFAULT_COMPONENTS
  const componentSet = new Set(components)
  const lineStarts = buildLineIndex(source)
  const usages: ExtractedUsage[] = []
  const n = source.length
  let i = 0

  while (i < n) {
    if (source[i] !== '<') {
      i++
      continue
    }
    // Candidate opening tag — read the tag name and check it against the set.
    let k = i + 1
    if (k >= n || !isIdentStart(source[k])) {
      i++
      continue
    }
    const nameStart = k
    while (k < n && /[\w.]/.test(source[k])) k++
    const tagName = source.slice(nameStart, k)
    if (!componentSet.has(tagName) || !isTagNameBoundary(source[k])) {
      i = k
      continue
    }
    const found = parseNameAttr(source, k)
    if (found) {
      const { line, column } = lineColAt(lineStarts, found.index)
      usages.push({ name: found.name, line, column })
    }
    i = k
  }

  return usages
}
