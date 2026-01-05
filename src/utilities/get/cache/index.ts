'use server'
import 'server-only' //DO NOT REMOVE
import { mt } from '@/utilities/mergeTags'
import { unstable_cache } from 'next/cache'
import { GCArgs, GCReturns, GCFunction, Last } from '@/ts/types'

//Getter Imports
import { getCachedPages } from './getPages'
import { getCachedImage } from './getImage'
import { getCachedFooter } from './getFooter'
import { getCachedHeader } from './getHeader'
import { getCachedSiteCSS } from './getSiteCSS'
import { getCachedSitemap } from './getSitemap'
import { getCachedPageByHref } from './getPage'
import { getCachedTracking } from './getTracking'
import { getCachedDesignSet } from './getDesignSet'
import { getCachedShortcutSet } from './getShortcutSet'
import { getCachedSiteMetadata } from './getSiteMetadata'
import { getCachedAtomicClasses } from './getAtomicClasses'
import { getCachedAtomicActions } from './getAtomicActions'
import { getCachedFormSubmissions } from './getFormSubmissions'
import { getCachedIconByName, getCachedIconSet, getCachedIconOptions } from './getIcon'
import { getCachedAllForms, getCachedAtomicForms, getCachedBackendForms } from './getForms'

const getRegistry = {
  pages: getCachedPages,
  image: getCachedImage,
  header: getCachedHeader,
  footer: getCachedFooter,
  page: getCachedPageByHref,
  icon: getCachedIconByName,
  sitemap: getCachedSitemap,
  iconSet: getCachedIconSet,
  tracking: getCachedTracking,
  'site-css': getCachedSiteCSS,
  designSet: getCachedDesignSet,
  'all-forms': getCachedAllForms,
  shortcutSet: getCachedShortcutSet,
  'atomic-forms': getCachedAtomicForms,
  'icon-options': getCachedIconOptions,
  'site-metadata': getCachedSiteMetadata,
  'backend-forms': getCachedBackendForms,
  'atomic-classes': getCachedAtomicClasses,
  'atomic-actions': getCachedAtomicActions,
  'form-submissions': getCachedFormSubmissions,
}

async function getCached(...args: GCArgs<'icon'>): GCReturns<'icon'>
async function getCached(...args: GCArgs<'page'>): GCReturns<'page'>
async function getCached(...args: GCArgs<'image'>): GCReturns<'image'>
async function getCached(...args: GCArgs<'pages'>): GCReturns<'pages'>
async function getCached(...args: GCArgs<'header'>): GCReturns<'header'>
async function getCached(...args: GCArgs<'footer'>): GCReturns<'footer'>
async function getCached(...args: GCArgs<'sitemap'>): GCReturns<'sitemap'>
async function getCached(...args: GCArgs<'iconSet'>): GCReturns<'iconSet'>
async function getCached(...args: GCArgs<'site-css'>): GCReturns<'site-css'>
async function getCached(...args: GCArgs<'tracking'>): GCReturns<'tracking'>
async function getCached(...args: GCArgs<'all-forms'>): GCReturns<'all-forms'>
async function getCached(...args: GCArgs<'designSet'>): GCReturns<'designSet'>
async function getCached(...args: GCArgs<'shortcutSet'>): GCReturns<'shortcutSet'>
async function getCached(...args: GCArgs<'atomic-forms'>): GCReturns<'atomic-forms'>
async function getCached(...args: GCArgs<'icon-options'>): GCReturns<'icon-options'>
async function getCached(...args: GCArgs<'backend-forms'>): GCReturns<'backend-forms'>
async function getCached(...args: GCArgs<'site-metadata'>): GCReturns<'site-metadata'>
async function getCached(...args: GCArgs<'atomic-classes'>): GCReturns<'atomic-classes'>
async function getCached(...args: GCArgs<'atomic-actions'>): GCReturns<'atomic-actions'>
async function getCached(...args: GCArgs<'form-submissions'>): GCReturns<'form-submissions'>
async function getCached(...args: GCArgs<'all'>): GCReturns<'all'> {
  const [tag, a, b] = args
  let tid = ''
  let draft = false

  if (typeof a === 'string') tid = a
  if (typeof a === 'boolean') draft = a
  if (typeof b === 'boolean') draft = b

  const draftTag: 'draft' | undefined = draft ? 'draft' : undefined

  // Key parts are used to create the cache key that identifies this specific cache.
  // e.g: ['pages', '/example', 'draft']
  const keyParts: string[] = [tag] /* 'page' */
  if (tid) keyParts.push(tid) /* '/example' */
  if (draft) keyParts.push('draft') /* 'draft' */

  // When any tag inside dependencyTags is revalidated, this cache will be busted.
  // e.g: ['pages', 'draft', '/example', 'pages:draft']
  const dependencyTags: string[] = [tag]
  if (tid) dependencyTags.push(tid) /* '/example' */
  if (draft) dependencyTags.push(mt([tag, draftTag])) /* 'page:draft' */
  dependencyTags.push(draft ? 'draft' : 'published') /* Enables revalidation of all draft or published documents respectively */
  if (tid) dependencyTags.push(mt([tag, tid, draftTag])) /* 'page:/example:draft' */

  const getter = getRegistry[tag] as GCFunction<typeof tag>

  // Additional dependency tags
  switch (tag) {
    case 'icon': {
      const iconSet = args[args.length - 1] as Last<typeof args>
      dependencyTags.push(mt(['iconSet', draftTag]))
      //If you update the icon doc, this ensures the icon is updated.
      const iconItem = iconSet.iconsArray?.find((item) => item.name === tid)
      if (iconItem && iconItem.icon) dependencyTags.push(mt(['icon', iconItem.icon]))
      break
    }
    case 'icon-options': {
      dependencyTags.push(mt(['iconSet', draftTag]))
      break
    }
    case 'form-submissions': {
      dependencyTags.push(mt(['backend-forms']))
      break
    }
    case 'atomic-actions': {
      dependencyTags.push(mt(['settings', draftTag]))
      break
    }
    case 'all-forms': {
      dependencyTags.push(mt(['backend-forms']))
      dependencyTags.push(mt(['atomic-forms', draftTag]))
      break
    }
    default:
      break
  }

  return unstable_cache(async () => getter(...args), keyParts, { tags: dependencyTags })()
}

export default getCached
