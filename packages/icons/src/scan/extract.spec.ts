import { describe, expect, it } from 'vitest'

import { extractIconUsages } from './extract'

/** Convenience: just the names, in source order. */
const names = (src: string, components?: string[]): string[] => extractIconUsages(src, components ? { components } : undefined).map((u) => u.name)

describe('extractIconUsages — literal forms', () => {
  it('reads a double-quoted attribute string', () => {
    expect(names('<Icon name="arrow-right" />')).toEqual(['arrow-right'])
  })

  it('reads a single-quoted attribute string', () => {
    expect(names("<Icon name='chevron' />")).toEqual(['chevron'])
  })

  it('reads a string literal inside an expression container', () => {
    expect(names('<Icon name={"x"} />')).toEqual(['x'])
    expect(names("<Icon name={'y'} />")).toEqual(['y'])
  })

  it('reads a non-interpolated template literal', () => {
    expect(names('<Icon name={`logo`} />')).toEqual(['logo'])
  })

  it('decodes simple escapes in the literal', () => {
    expect(names('<Icon name="a\\nb" />')).toEqual(['a\nb'])
  })
})

describe('extractIconUsages — dynamic values are skipped', () => {
  it('skips a bare identifier expression', () => {
    expect(names('<Icon name={iconName} />')).toEqual([])
  })

  it('skips string concatenation', () => {
    expect(names('<Icon name={"a" + b} />')).toEqual([])
  })

  it('skips an interpolated template', () => {
    // biome-ignore lint/suspicious/noTemplateCurlyInString: `${slug}` is literal scanner input, not a template
    expect(names('<Icon name={`icon-${slug}`} />')).toEqual([])
  })
})

describe('extractIconUsages — tag matching', () => {
  it('does not match a different component', () => {
    expect(names('<MyIcon name="x" />')).toEqual([])
    expect(names('<Iconame name="x" />')).toEqual([])
  })

  it('does not match a closing tag', () => {
    expect(names('<Icon name="x"></Icon>')).toEqual(['x'])
  })

  it('honors a custom component list', () => {
    expect(names('<Glyph name="star" />', ['Glyph'])).toEqual(['star'])
    expect(names('<Icon name="star" />', ['Glyph'])).toEqual([])
  })

  it('matches multiple configured components', () => {
    expect(names('<Icon name="a" /><Glyph name="b" />', ['Icon', 'Glyph'])).toEqual(['a', 'b'])
  })
})

describe('extractIconUsages — attribute parsing robustness', () => {
  it('does not treat a name substring of another attribute as the name', () => {
    expect(names('<Icon iconName="nope" data-name="also-nope" name="real" />')).toEqual(['real'])
  })

  it('ignores a "name" key inside another attribute expression', () => {
    expect(names('<Icon title={user.name} name="real" />')).toEqual(['real'])
  })

  it('handles a ">" inside an expression attribute before name', () => {
    expect(names('<Icon hidden={count > 3} name="ok" />')).toEqual(['ok'])
  })

  it('skips a spread attribute and still finds name', () => {
    expect(names('<Icon {...rest} name="ok" />')).toEqual(['ok'])
  })

  it('handles boolean attributes before name', () => {
    expect(names('<Icon hidden focusable name="ok" />')).toEqual(['ok'])
  })

  it('returns nothing when name is absent', () => {
    expect(names('<Icon className="size-6" />')).toEqual([])
  })
})

describe('extractIconUsages — multiple usages and locations', () => {
  const src = ['<div>', '  <Icon name="first" />', '  <Icon name="second" />', '</div>'].join('\n')

  it('finds every usage in source order', () => {
    expect(names(src)).toEqual(['first', 'second'])
  })

  it('reports 1-based line and column of the value', () => {
    const usages = extractIconUsages(src)
    expect(usages[0].line).toBe(2)
    // `  <Icon name="first"` — the opening quote sits at column 14.
    expect(usages[0].column).toBe(14)
    expect(usages[1].line).toBe(3)
  })
})

describe('extractIconUsages — multiline and surrounding text', () => {
  it('finds a usage that follows an apostrophe in JSX text', () => {
    // A naive whole-file string lexer would swallow this from `it's` onward.
    expect(names('<p>it\'s here: <Icon name="ghost" /></p>')).toEqual(['ghost'])
  })

  it('finds a usage after a URL in JSX text', () => {
    expect(names('<p>see http://x.test <Icon name="link" /></p>')).toEqual(['link'])
  })

  it('parses attributes spread across lines', () => {
    expect(names('<Icon\n  className="size-6"\n  name="multi"\n/>')).toEqual(['multi'])
  })
})
