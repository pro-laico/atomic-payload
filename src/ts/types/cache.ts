import {
  Form,
  Page,
  Footer,
  Header,
  Tracking,
  DesignSet,
  ImageChild,
  ShortcutSet,
  SiteMetaDatum,
  FormSubmission,
  StoredAtomicForm,
  AtomicStoreInitialState,
  ModifiedStoredAtomicForm,
} from '@/ts/types'

// /////////////////////////////////////
// General Types
// /////////////////////////////////////

type TID = {
  /** Tag Identifier
   *
   * The identifier of the document to revalidate.
   * Results in a unique cache dependency key added to the getCache function.
   * Currently implemented cached getters using tid:
   *
   * page - 'href'
   *
   * icon - 'name' (name grabbed from iconSet, not icon doc)
   *
   * form-submissions - 'form' (name of backend form)
   *
   * image - 'updatedAt'
   *
   * @example 'page:/testing' || 'icon:/logo' || 'form-submissions:/contact-form'
   */
  tid: string
}

type Draft = {
  /** When true, only the unpublished documents tag will be revalidated. That way the published site isn't needlessly gettings it's cache busted. */
  draft: boolean
}

/** Array elements data returned by the getCached<'sitemap'> function. */
export type SiteMapEntry = {
  url: string
  priority: number
  lastModified: string
  changeFrequency: 'yearly' | 'monthly' | 'weekly' | 'daily' | 'hourly' | 'never'
}

/** Data returned by the revalidateTag function. */
export type RevalidateTagResponse = { success: boolean; message: string; timestamp: string }

// /////////////////////////////////////
// Tags
// /////////////////////////////////////

// When adding a new tag, also add the corresponding overload at /utilities/get/cache/index.ts
type PageTags = 'page'
type CacheTags = 'draft' | 'published'
type GlobalsTags = 'tracking' | 'settings'
type CSSTags = 'site-css' | 'atomic-classes'
type IconTags = 'iconSet' | 'icon' | 'icon-options'
type CollectionsTags = 'designSet' | 'footer' | 'header' | 'shortcutSet'
type FrontEndTags = 'sitemap' | 'pages' | 'site-metadata' | 'atomic-actions'
type FormsTags = 'atomic-forms' | 'all-forms' | 'form-submissions' | 'backend-forms' | 'image'

// Tags that for the revalidateTag function, has a promise return type.
export type PromiseTagGroup = 'draft' | 'published'
// Tags that have no corresponding getCached function.
export type TagsWithNoGetters = 'draft' | 'published' | 'settings'
// Adds a id key to the tag.
export type IDTagGroup = 'page' | 'icon' | 'form-submissions' | 'image'
// Tags that dont handle for draft or published.
export type NoDraftTagGroup = 'backend-forms' | 'form-submissions' | 'draft' | 'published' | 'image'

export type AllTags = CSSTags | GlobalsTags | IconTags | FrontEndTags | PageTags | FormsTags | CollectionsTags | CacheTags
export type AllTagsWithGetters = Exclude<AllTags, TagsWithNoGetters>

type Tag<T extends AllTags> = T extends NoDraftTagGroup
  ? T extends IDTagGroup
    ? { tag: T } & TID
    : { tag: T }
  : T extends IDTagGroup
    ? { tag: T } & TID & Draft
    : { tag: T } & Draft

// /////////////////////////////////////
// Revalidate Tag Function Types
// /////////////////////////////////////

export type RevalidateTagType =
  | { args: Tag<'page'>; return: void }
  | { args: Tag<'icon'>; return: void }
  | { args: Tag<'image'>; return: void }
  | { args: Tag<'pages'>; return: void }
  | { args: Tag<'header'>; return: void }
  | { args: Tag<'footer'>; return: void }
  | { args: Tag<'sitemap'>; return: void }
  | { args: Tag<'iconSet'>; return: void }
  | { args: Tag<'site-css'>; return: void }
  | { args: Tag<'tracking'>; return: void }
  | { args: Tag<'settings'>; return: void }
  | { args: Tag<'all-forms'>; return: void }
  | { args: Tag<'designSet'>; return: void }
  | { args: Tag<'shortcutSet'>; return: void }
  | { args: Tag<'icon-options'>; return: void }
  | { args: Tag<'atomic-forms'>; return: void }
  | { args: Tag<'backend-forms'>; return: void }
  | { args: Tag<'site-metadata'>; return: void }
  | { args: Tag<'atomic-classes'>; return: void }
  | { args: Tag<'atomic-actions'>; return: void }
  | { args: Tag<'form-submissions'>; return: void }
  | { args: Tag<'draft'>; return: RevalidateTagResponse }
  | { args: Tag<'published'>; return: RevalidateTagResponse }

/** The pass through arguments for the revalidate tag function. Set to 'all' to get the parameters for all tags. Mainly just for function overload. */
export type RArgs<T extends AllTags | 'all'> = T extends AllTags ? Extract<RevalidateTagType, { args: Tag<T> }>['args'] : RevalidateTagType['args']

/** The return type of the revalidate tag function. Set to 'all' to get the return type for all tags. Mainly just for function overload. */
export type RReturns<T extends AllTags | 'all'> = Promise<
  T extends AllTags ? Extract<RevalidateTagType, { args: Tag<T> }>['return'] : RevalidateTagType['return']
>

// /////////////////////////////////////
// Get Cache Function Types
// /////////////////////////////////////
/** Data returned by the getCached<'iconSet'> function. */
export type IconSetReturn = { iconsArray: { name: string; icon: string }[] }
/** Data returned by the getCached<'page'> function. */
export type PageReturn = Pick<Page, 'children' | 'mainClassName' | 'meta' | 'id'>
export type StoredAtomicActionsReturn = AtomicStoreInitialState

type PageArgs = { pages: string[] } // Used on tag 'page'
type ImageArgs = { version?: ImageChild['version'] } // Used on tag 'image'
type IconArgs = { iconSet: IconSetReturn } // Used on tags 'icon' and 'icon-options'
type AllFormsArgs = { atomicForms: StoredAtomicForm[]; backendForms: Form[] } // Used on tag 'all-forms'

export type GetCached =
  | { args: Tag<'header'>; return: Header }
  | { args: Tag<'footer'>; return: Footer }
  | { args: Tag<'pages'>; return: string[] }
  | { args: Tag<'site-css'>; return: string }
  | { args: Tag<'designSet'>; return: DesignSet }
  | { args: Tag<'backend-forms'>; return: Form[] }
  | { args: Tag<'iconSet'>; return: IconSetReturn }
  | { args: Tag<'sitemap'>; return: SiteMapEntry[] }
  | { args: Tag<'shortcutSet'>; return: ShortcutSet }
  | { args: Tag<'atomic-classes'>; return: string[] }
  | { args: Tag<'tracking'>; return: Tracking | undefined }
  | { args: Tag<'form-submissions'>; return: FormSubmission[] }
  | { args: Tag<'icon'> & IconArgs; return: string | undefined }
  | { args: Tag<'image'> & ImageArgs; return: string | undefined }
  | { args: Tag<'atomic-actions'>; return: AtomicStoreInitialState }
  | { args: Tag<'page'> & PageArgs; return: PageReturn | undefined }
  | { args: Tag<'site-metadata'>; return: SiteMetaDatum | undefined }
  | { args: Tag<'atomic-forms'>; return: StoredAtomicForm[] | undefined }
  | { args: Tag<'icon-options'> & IconArgs; return: { label: string; value: string }[] }
  | { args: Tag<'all-forms'> & AllFormsArgs; return: ModifiedStoredAtomicForm[] | undefined }

/** The pass through arguments for the get cache function. Set to 'all' to get the parameters for all tags. Mainly just for function overload. */
export type GCArgs<T extends AllTagsWithGetters | 'all'> = T extends AllTagsWithGetters
  ? Extract<GetCached, { args: Tag<T> }>['args']
  : GetCached['args']
/** The return type of the get cached functions. Set to 'all' to get the return type for all tags. Mainly just for function overload. */
export type GCReturns<T extends AllTagsWithGetters | 'all'> = T extends AllTagsWithGetters
  ? Promise<Extract<GetCached, { args: Tag<T> }>['return']>
  : Promise<GetCached['return']>

/** Function type for get cached functions. Used directly on variable definition getters. */
export type GCFunction<T extends AllTagsWithGetters> = (
  args: Extract<GetCached, { args: { tag: T } }>['args'],
) => Promise<Extract<GetCached, { args: { tag: T } }>['return']>

// /////////////////////////////////////
// Miscellaneous Types
// /////////////////////////////////////

export type RevalidationLoggerType = string[]
export type CacheLoggerType<T extends AllTagsWithGetters> = (args: RArgs<T>) => void
