import { describe, expect, it } from 'vitest'

import deepMerge, { isObject } from './deepMerge'
import { mt } from './mergeTags'
import { toKebabCase } from './toKebabCase'
import { toTitleCase } from './toTitleCase'

describe('toKebabCase', () => {
  it('replaces non-alphanumeric runs with a single dash', () => {
    expect(toKebabCase('Hello World')).toBe('Hello-World')
  })
  it('lowercases when the option is set', () => {
    expect(toKebabCase('Hello World', { lowercase: true })).toBe('hello-world')
  })
  it('splits camelCase boundaries when enabled', () => {
    expect(toKebabCase('fooBar', { camelCaseHandling: true, lowercase: true })).toBe('foo-bar')
  })
  it('returns empty string for empty/nullish input', () => {
    expect(toKebabCase('')).toBe('')
    expect(toKebabCase(null)).toBe('')
    expect(toKebabCase(undefined)).toBe('')
  })
})

describe('toTitleCase', () => {
  it('capitalizes lowercase words', () => {
    expect(toTitleCase('hello world')).toBe('Hello World')
  })
  it('splits camelCase and preserves already-capitalized words', () => {
    expect(toTitleCase('fooBar')).toBe('Foo Bar')
  })
  it('keeps all-caps acronyms intact', () => {
    expect(toTitleCase('API')).toBe('API')
  })
  it('treats hyphens and underscores as word separators', () => {
    expect(toTitleCase('hello-world_foo')).toBe('Hello World Foo')
  })
  it('returns empty string for nullish input', () => {
    expect(toTitleCase(null)).toBe('')
  })
})

describe('mt (merge tags)', () => {
  it('joins parts with a colon', () => {
    expect(mt(['a', 'b'])).toBe('a:b')
  })
  it('drops null/undefined/empty parts but keeps 0', () => {
    expect(mt(['a', undefined, '', 'b'])).toBe('a:b')
    expect(mt(['a', 0, 'b'])).toBe('a:0:b')
  })
  it('returns empty string for an empty array', () => {
    expect(mt([])).toBe('')
  })
})

describe('deepMerge', () => {
  it('recursively merges nested objects', () => {
    expect(deepMerge({ a: 1, b: { x: 1 } }, { b: { y: 2 }, c: 3 })).toEqual({ a: 1, b: { x: 1, y: 2 }, c: 3 })
  })
  it('overrides primitives from the source', () => {
    expect(deepMerge({ a: 1 }, { a: 2 })).toEqual({ a: 2 })
  })
  it('replaces (does not concat) arrays', () => {
    expect(deepMerge({ a: [1, 2] }, { a: [3] })).toEqual({ a: [3] })
  })

  it('isObject distinguishes plain objects from arrays', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(false)
  })
})
