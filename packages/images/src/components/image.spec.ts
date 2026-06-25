import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'

import { ResponsiveImage, type ResponsiveImageProps } from './image'

// ResponsiveImage returns `<span style=…><FadeImg …/></span>`. Inspect the returned
// element tree (the package doesn't depend on react-dom, so we don't render to HTML).
const tree = (props: ResponsiveImageProps): ReactElement | null => ResponsiveImage(props)
const fadeProps = (el: ReactElement): any => (el.props as any).children.props
const spanStyle = (el: ReactElement): any => (el.props as any).style

describe('ResponsiveImage', () => {
  it('returns null for an empty id', () => {
    expect(tree({ image: '' })).toBeNull()
    expect(tree({ image: { id: '' } })).toBeNull()
  })

  it('builds a transform-URL srcset/src and resolves the alt', () => {
    const el = tree({ image: { id: 'abc', width: 800, height: 600, alt: 'A cat' }, aspectRatio: '4:3' })
    expect(el).not.toBeNull()
    const img = fadeProps(el as ReactElement)
    expect(img.srcSet).toContain('/api/img/abc?')
    expect(img.src).toContain('/api/img/abc?')
    expect(img.alt).toBe('A cat')
  })

  it('falls back to the populated doc alt and omits the blur background when absent', () => {
    const el = tree({ image: { id: 'abc', alt: 'from doc' } }) as ReactElement
    expect(fadeProps(el).alt).toBe('from doc')
    expect(spanStyle(el).backgroundImage).toBeUndefined()
  })

  it('sets the blur background and a fade duration when a blur is provided', () => {
    const el = tree({ image: { id: 'abc' }, blurDataURL: 'data:image/png;base64,AAAA', fadeDurationMs: 300 }) as ReactElement
    expect(String(spanStyle(el).backgroundImage)).toContain('data:image/png;base64,AAAA')
    expect(fadeProps(el).fadeMs).toBe(300)
  })

  it('disables the fade (fadeMs 0) when there is no blur to fade over', () => {
    const el = tree({ image: { id: 'abc' } }) as ReactElement
    expect(fadeProps(el).fadeMs).toBe(0)
  })

  it('threads a custom endpoint path into the generated URLs', () => {
    const el = tree({ image: 'xyz', path: '/api/image' }) as ReactElement
    expect(fadeProps(el).src).toContain('/api/image/xyz?')
    expect(fadeProps(el).src).not.toContain('/api/img/xyz?')
  })

  it('bakes a v= cache-buster derived from the doc filename + focal', () => {
    const el = tree({ image: { id: 'abc', filename: 'a.png', focalX: 80, focalY: 20 } }) as ReactElement
    expect(fadeProps(el).src).toMatch(/[?&]v=/)
  })

  it('omits v= for a bare id (no source identity to derive from)', () => {
    const el = tree({ image: 'abc' }) as ReactElement
    expect(fadeProps(el).src).not.toContain('v=')
  })

  it('lets an explicit version prop override the derived one', () => {
    const el = tree({ image: { id: 'abc', filename: 'a.png', focalX: 80, focalY: 20 }, version: 'pinned1' }) as ReactElement
    expect(fadeProps(el).src).toContain('v=pinned1')
  })

  it('fill mode: absolutely positions the wrapper and fills the parent height', () => {
    const el = tree({ image: { id: 'abc', width: 800, height: 600 }, fill: true }) as ReactElement
    expect(spanStyle(el).position).toBe('absolute')
    expect(spanStyle(el).inset).toBe(0)
    expect(spanStyle(el).height).toBe('100%')
  })

  it('fill mode: the <img> covers with no aspect-ratio (even given natural dims or an explicit ratio)', () => {
    const el = tree({ image: { id: 'abc', width: 800, height: 600 }, aspectRatio: '4:3', fill: true }) as ReactElement
    const base = fadeProps(el).baseStyle
    expect(base.height).toBe('100%')
    expect(base.aspectRatio).toBeUndefined()
    expect(base.objectFit).toBe('cover')
  })

  it('fill mode still paints the blur background and fades', () => {
    const el = tree({ image: { id: 'abc' }, fill: true, blurDataURL: 'data:image/png;base64,AAAA' }) as ReactElement
    expect(String(spanStyle(el).backgroundImage)).toContain('data:image/png;base64,AAAA')
    expect(fadeProps(el).fadeMs).toBeGreaterThan(0)
  })
})
