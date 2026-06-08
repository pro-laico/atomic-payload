import type { StoredAtomicActions } from '@pro-laico/atomic/actions/schema'
/** Narrow getter used by `createCssProcessor` (e.g. app `getCached` / `unstable_cache` wrapper). */
export type AtomicHookGetCached = (tag: string, draft: boolean) => Promise<unknown>

/** Constructor for `@pro-laico/atomic/actions/processor` (passed from the app to avoid pulling actions into this package's tsc graph). */
export type ActionBlockStorageProcessorClass = new () => {
  setKeyInitialValueByBlock: (args: { node: unknown }) => void
  before: (args: { node: object; path: string[] }) => void
  after: (args: { node: object; path: string[] }) => void
  getAllActionBlocks: () => StoredAtomicActions | undefined
}

/** Flags returned by a slug's unsetActive cleanup entry; mark which downstream passes need to run after another doc is unset. */
export type UnsetActiveCleanupFlags = { forms?: boolean; classes?: boolean; actions?: boolean }

/** Per-slug configuration that lets atomic stay agnostic about the consumer's collection/global slug names. */
export type AtomicHookSlugConfig = {
  /** Slug whose docs have breadcrumb/href and trigger href-related revalidations. Defaults to `'pages'`. */
  pagesSlug?: string
  /** Slug whose data should run through `processDesignSet` before storage. Defaults to `'designSet'`. */
  designSetSlug?: string
  /** Slug → cleanup flags applied when `unsetActive` returns that slug. */
  unsetActiveCleanup?: Record<string, UnsetActiveCleanupFlags>
  /** Slugs to skip when running cssProcessor (e.g. icon-only collections). Defaults to `['iconSet']`. */
  cssProcessorSkipSlugs?: string[]
  /** Slug → cached-tag key fetched by cssProcessor's getCached calls. */
  cssCacheTagBySlug?: Record<string, string>
  /** Global slugs that cssProcessor writes generated CSS to. Defaults to `{ draft: 'draftStorage', published: 'publishedStorage' }`. */
  cssStorageGlobals?: { draft: string; published: string }
}

export type CreateAtomicHookOptions = AtomicHookSlugConfig & {
  getCached: AtomicHookGetCached
  ActionBlockStorageProcessor: ActionBlockStorageProcessorClass
}

/** The default slug-config used when no overrides are passed; matches the atomic-payload template's collection/global names. */
export const DEFAULT_ATOMIC_HOOK_SLUG_CONFIG: Required<AtomicHookSlugConfig> = {
  pagesSlug: 'pages',
  designSetSlug: 'designSet',
  unsetActiveCleanup: {
    header: { forms: true, classes: true, actions: true },
    footer: { forms: true, classes: true, actions: true },
    designSet: { classes: true },
    shortcutSet: { classes: true },
  },
  cssProcessorSkipSlugs: ['iconSet'],
  cssCacheTagBySlug: { header: 'header', footer: 'footer', designSet: 'designSet', shortcutSet: 'shortcutSet' },
  cssStorageGlobals: { draft: 'draftStorage', published: 'publishedStorage' },
}
