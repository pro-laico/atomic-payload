import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'

import { ResponsiveImage, type ResponsiveImageProps } from './image'

// ResponsiveImage returns `<span style=…><img …/></span>` — fully server-rendered, no
// client component. Inspect the returned element tree (the package doesn't depend on
// react-dom, so we don't render to HTML).
const tree = (props: ResponsiveImageProps): ReactElement | null => ResponsiveImage(props)
const imgProps = (el: ReactElement): any => (el.props as any).children.props
const spanStyle = (el: ReactElement): any => (el.props as any).style

describe('ResponsiveImage', () => {
  it('returns null for an empty id', () => {
    expect(tree({ image: '' })).toBeNull()
    expect(tree({ image: { id: '' } })).toBeNull()
  })

  it('builds a transform-URL srcset/src and resolves the alt', () => {
    const el = tree({ image: { id: 'abc', width: 800, height: 600, alt: 'A cat' }, aspectRatio: '4:3' })
    expect(el).not.toBeNull()
    const img = imgProps(el as ReactElement)
    expect(img.srcSet).toContain('/api/img/abc?')
    expect(img.src).toContain('/api/img/abc?')
    expect(img.alt).toBe('A cat')
  })

  it('paints the placeholder from the smallest transform variant by default', () => {
    const el = tree({ image: { id: 'abc', alt: 'from doc' } }) as ReactElement
    expect(imgProps(el).alt).toBe('from doc')
    // Tiny, low-quality variant of the same image, used as the wrapper background.
    expect(String(spanStyle(el).backgroundImage)).toMatch(/url\(\/api\/img\/abc\?[^)]*\bw=32\b/)
    expect(String(spanStyle(el).backgroundImage)).toContain('q=40')
  })

  it('omits the placeholder background when blur is false', () => {
    const el = tree({ image: { id: 'abc' }, blur: false }) as ReactElement
    expect(spanStyle(el).backgroundImage).toBeUndefined()
  })

  it('renders a plain <img> (no fade props, no client wrapper)', () => {
    const el = tree({ image: { id: 'abc' } }) as ReactElement
    const img = imgProps(el)
    expect(img.fadeMs).toBeUndefined()
    expect(img.baseStyle).toBeUndefined()
    expect(img.style.objectFit).toBe('cover')
  })

  it('threads a custom endpoint path into the generated URLs', () => {
    const el = tree({ image: 'xyz', path: '/api/image' }) as ReactElement
    expect(imgProps(el).src).toContain('/api/image/xyz?')
    expect(imgProps(el).src).not.toContain('/api/img/xyz?')
  })

  it('bakes a v= cache-buster derived from the doc filename + focal', () => {
    const el = tree({ image: { id: 'abc', filename: 'a.png', focalX: 80, focalY: 20 } }) as ReactElement
    expect(imgProps(el).src).toMatch(/[?&]v=/)
  })

  it('omits v= for a bare id (no source identity to derive from)', () => {
    const el = tree({ image: 'abc' }) as ReactElement
    expect(imgProps(el).src).not.toContain('v=')
  })

  it('lets an explicit version prop override the derived one', () => {
    const el = tree({ image: { id: 'abc', filename: 'a.png', focalX: 80, focalY: 20 }, version: 'pinned1' }) as ReactElement
    expect(imgProps(el).src).toContain('v=pinned1')
  })

  it('fill mode: absolutely positions the wrapper and fills the parent height', () => {
    const el = tree({ image: { id: 'abc', width: 800, height: 600 }, fill: true }) as ReactElement
    expect(spanStyle(el).position).toBe('absolute')
    expect(spanStyle(el).inset).toBe(0)
    expect(spanStyle(el).height).toBe('100%')
  })

  it('fill mode: the <img> covers with no aspect-ratio (even given natural dims or an explicit ratio)', () => {
    const el = tree({ image: { id: 'abc', width: 800, height: 600 }, aspectRatio: '4:3', fill: true }) as ReactElement
    const style = imgProps(el).style
    expect(style.height).toBe('100%')
    expect(style.aspectRatio).toBeUndefined()
    expect(style.objectFit).toBe('cover')
  })

  it('fill mode still paints the placeholder background', () => {
    const el = tree({ image: { id: 'abc' }, fill: true }) as ReactElement
    expect(String(spanStyle(el).backgroundImage)).toContain('/api/img/abc?')
  })
})
