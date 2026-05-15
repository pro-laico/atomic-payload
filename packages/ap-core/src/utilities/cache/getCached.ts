import 'server-only'
import { unstable_cache } from 'next/cache'
import { mt } from '../mergeTags'
import type { AllTagsWithGetters, GCArgs, GCReturns, GCFunction, IconSetReturn, PayloadConfigPromise } from '../../types/cache'
export type GetRegistry = { [K in AllTagsWithGetters]: GCFunction<K> }

export interface GetCachedFn {
  (...args: GCArgs<'icon'>): GCReturns<'icon'>
  (...args: GCArgs<'page'>): GCReturns<'page'>
  (...args: GCArgs<'image'>): GCReturns<'image'>
  (...args: GCArgs<'pages'>): GCReturns<'pages'>
  (...args: GCArgs<'header'>): GCReturns<'header'>
  (...args: GCArgs<'footer'>): GCReturns<'footer'>
  (...args: GCArgs<'sitemap'>): GCReturns<'sitemap'>
  (...args: GCArgs<'iconSet'>): GCReturns<'iconSet'>
  (...args: GCArgs<'site-css'>): GCReturns<'site-css'>
  (...args: GCArgs<'tracking'>): GCReturns<'tracking'>
  (...args: GCArgs<'all-forms'>): GCReturns<'all-forms'>
  (...args: GCArgs<'designSet'>): GCReturns<'designSet'>
  (...args: GCArgs<'shortcutSet'>): GCReturns<'shortcutSet'>
  (...args: GCArgs<'atomic-forms'>): GCReturns<'atomic-forms'>
  (...args: GCArgs<'icon-options'>): GCReturns<'icon-options'>
  (...args: GCArgs<'backend-forms'>): GCReturns<'backend-forms'>
  (...args: GCArgs<'site-metadata'>): GCReturns<'site-metadata'>
  (...args: GCArgs<'atomic-classes'>): GCReturns<'atomic-classes'>
  (...args: GCArgs<'atomic-actions'>): GCReturns<'atomic-actions'>
  (...args: GCArgs<'form-submissions'>): GCReturns<'form-submissions'>
}

export function createGetCached(configPromise: PayloadConfigPromise, getRegistry: GetRegistry): GetCachedFn {
  const getCached = async (...args: GCArgs<'all'>): GCReturns<'all'> => {
    const [tag, a, b] = args
    let tid = ''
    let draft = false

    if (typeof a === 'string') tid = a
    if (typeof a === 'boolean') draft = a
    if (typeof b === 'boolean') draft = b

    const draftTag: 'draft' | undefined = draft ? 'draft' : undefined

    const keyParts: string[] = [tag]
    if (tid) keyParts.push(tid)
    if (draft) keyParts.push('draft')

    const dependencyTags: string[] = [tag]
    if (tid) dependencyTags.push(tid)
    if (draft) dependencyTags.push(mt([tag, draftTag]))
    dependencyTags.push(draft ? 'draft' : 'published')
    if (tid) dependencyTags.push(mt([tag, tid, draftTag]))

    const getter = getRegistry[tag] as GCFunction<typeof tag>

    switch (tag) {
      case 'icon': {
        const iconSet = args[args.length - 1] as IconSetReturn
        dependencyTags.push(mt(['iconSet', draftTag]))
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

    return unstable_cache(async () => getter(configPromise, ...args), keyParts, { tags: dependencyTags })()
  }

  return getCached as GetCachedFn
}
