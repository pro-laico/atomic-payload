import { revalidateTag } from '@pro-laico/core'
import type { CollectionBeforeChangeHook } from 'payload'

import processDesignSet from '../processDesignSet'
import manualLogger from '../utilities/manualLogger'
import { type CssProcessorGetCached, createCssProcessor } from '../cssProcessor'

/** Options for the standalone CSS beforeChange hook. All default to the
 *  atomic-payload-conventional slug/global names. */
export type CssHookOptions = {
  /** Map of slug → cached-tag key used by the processor's `getCached` calls. */
  cssCacheTagBySlug?: Record<string, string>
  /** Global slugs the generated CSS is written to. */
  cssStorageGlobals?: { draft: string; published: string }
  /** Slug whose data is run through `processDesignSet` before storage. */
  designSetSlug?: string
  /** Slugs to skip entirely (e.g. icon-only collections). */
  cssProcessorSkipSlugs?: string[]
}

const DEFAULTS = {
  designSetSlug: 'designSet',
  cssProcessorSkipSlugs: ['iconSet'] as string[],
  cssCacheTagBySlug: { header: 'header', footer: 'footer', designSet: 'designSet', shortcutSet: 'shortcutSet' } as Record<string, string>,
  cssStorageGlobals: { draft: 'draftStorage', published: 'publishedStorage' },
}

/** Recursively gather every `*ClassName` string value into `out`. Mirrors the
 *  class-collection pass the monolithic `atomicHook` runs, but with no extra
 *  deps so this package can process CSS on its own. */
function collectClassNames(node: unknown, out: Set<string>): void {
  if (Array.isArray(node)) {
    for (const child of node) collectClassNames(child, out)
    return
  }
  if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (key.endsWith('ClassName') && typeof value === 'string') {
        for (const cls of value.split(/\s+/)) {
          const trimmed = cls.trim()
          if (trimmed) out.add(trimmed)
        }
      } else {
        collectClassNames(value, out)
      }
    }
  }
}

/**
 * Standalone CSS `beforeChange` hook. Collects atomic classes from the document,
 * runs `processDesignSet` for the design-set collection, then regenerates the
 * stored stylesheet via the UnoCSS processor.
 *
 * It is intentionally redundant with `@pro-laico/atomic`'s all-in-one
 * `atomicHook`: when that hook is also attached to the collection it sets
 * `context.atomicHookRan`, and this hook then no-ops so CSS is only processed
 * once (by the more efficient atomicHook). Use this on its own when you want CSS
 * processing without the rest of the atomic runtime (forms/actions/APF).
 */
export function createCssHook(getCached: CssProcessorGetCached, options: CssHookOptions = {}): CollectionBeforeChangeHook {
  const designSetSlug = options.designSetSlug ?? DEFAULTS.designSetSlug
  const cacheTagBySlug = options.cssCacheTagBySlug ?? DEFAULTS.cssCacheTagBySlug
  const skip = new Set(options.cssProcessorSkipSlugs ?? DEFAULTS.cssProcessorSkipSlugs)
  const cssProcessor = createCssProcessor(getCached, {
    cssCacheTagBySlug: cacheTagBySlug,
    cssStorageGlobals: options.cssStorageGlobals ?? DEFAULTS.cssStorageGlobals,
  })

  return async ({ collection, context, data, req }) => {
    // Inert during seeding, or when the all-in-one atomicHook already owns this request.
    if (context.isSeed || context.atomicHookRan) return data
    const slug = collection.slug
    if (skip.has(slug)) return data

    const draft = data?._status === 'draft'

    const classes = new Set<string>()
    collectClassNames(data, classes)
    if ('storedAtomicClasses' in data) {
      const classesArray = Array.from(classes)
      ;(data as Record<string, unknown>).storedAtomicClasses = classesArray
      context.storedAtomicClasses = classesArray
      if (classesArray.length > 0)
        manualLogger(`[STORE] - Atomic Classes - ${(data as { title?: string })?.title ?? slug} - ${classesArray.length} Classes Stored`)
    }

    if (slug === designSetSlug) processDesignSet(data as unknown as Parameters<typeof processDesignSet>[0])
    ;(context as Record<string, unknown>)[slug] = data

    const cssSlug = slug as Parameters<typeof cssProcessor>[0]['slug']
    await cssProcessor({ slug: cssSlug, context, draft: true, req })
    if (!draft) await cssProcessor({ slug: cssSlug, context, draft: false, req })

    // The canonical atomicHook revalidates after regenerating; the standalone path
    // must too, or the regenerated stylesheet sits in storage while getCached keeps
    // serving stale inputs/CSS. Revalidate the changed set's tag (designSet/
    // shortcutSet cascade to 'site-css' in core), atomic-classes for page-like docs,
    // and 'site-css' explicitly so the served stylesheet is always busted.
    const setTag = cacheTagBySlug[slug]
    // All configured tags are collection tags (header/footer/designSet/shortcutSet)
    // sharing the same (tag, draft) overload; cast to one to satisfy the union.
    if (setTag) await revalidateTag(setTag as 'designSet', draft)
    if ('storedAtomicClasses' in data) await revalidateTag('atomic-classes', draft)
    await revalidateTag('site-css', draft)

    return data
  }
}
