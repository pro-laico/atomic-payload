'use server'
import { z } from '@/ts/zap'
import traverse from 'traverse'
import { runAPF } from '@/utilities/runAPF'
import manualLogger from '@/utilities/log/manual'
import sanitizeData from '@/utilities/sanitizeData'
import { revalidateTag } from '@/utilities/revalidateTag'
import type { CollectionBeforeChangeHook } from 'payload'
import { CollectionBySlug, CollectionThatUsesCSSProcessor, StoredAtomicForm, StoredAtomicFormInput } from '@/ts/types'

//Processors
import { unsetActive } from './processors/unsetActive'
import { cssProcessor } from './processors/cssProcessor'
import processDesignSet from './processors/processDesignSet'
import { ActionBlockStorageProcessor } from '@/blocks/actions/processor'

function findClosestParent(inputPath: string[], parentPaths: MapIterator<string>): string | null {
  const inputPathString = inputPath.join('.')
  let bestMatch = { length: 0, path: '' }

  for (const path of Array.from(parentPaths)) {
    if (inputPathString.startsWith(path) && path.length > bestMatch.length) bestMatch = { length: path.length, path }
  }
  return bestMatch.path
}

export const atomicHook: CollectionBeforeChangeHook = async ({ collection, context, data, originalDoc, operation, req }) => {
  if (context.isSeed) return // <- Can be removed if you no longer intend to seed the db
  const slug = z.ap.get('CollectionThatUsesAtomicHookSlug').parse(collection.slug)
  const draft = data?._status === 'draft'
  const isActive = Boolean(data?.active)
  const id = 'id' in originalDoc ? originalDoc?.id : undefined
  const hasChildren = 'children' in data && data?.children?.length > 0

  let href: string | undefined
  let runSlug = false
  if (slug === 'pages') {
    //KNOWN ISSUE: If a page is edited without any active triggers, the published version will not update since its tag isn't revalidated.
    //The solution must account for nested pages, so they don't also trigger a revalidation.
    const previousHref = data?.href
    // Because href is updated by its own field, we need to use breadcrumbs to get the latest href.
    href = data?.breadcrumbs && data?.breadcrumbs?.length > 0 ? data?.breadcrumbs[data?.breadcrumbs?.length - 1]?.url : undefined
    runSlug = operation !== 'create' ? (data?.slug !== originalDoc?.slug ? true : false) : data?.live
    if (operation !== 'create' && previousHref !== href ? true : false) await revalidateTag('page', previousHref, draft)
  }

  // Check to see what should be run based on the ap trigger values of the document. Do not pass sanitized data.
  const runSEO = runAPF({ context, id, apf: 'seo', data })
  const runPage = runAPF({ context, id, apf: 'page', data })
  const runForms = runAPF({ context, id, apf: 'form', data })
  const runPages = runAPF({ context, id, apf: 'pages', data })
  const runActive = runAPF({ context, id, apf: 'active', data })
  const runClasses = runAPF({ context, id, apf: 'classes', data })
  const runActions = runAPF({ context, id, apf: 'actions', data })
  const runSitemap = runAPF({ context, id, apf: 'sitemap', data })
  const runSiteMetadata = runAPF({ context, id, apf: 'siteMetadata', data })

  // Used to dedupe and add extra dependencies for processor triggers.
  const r = {
    forms: runForms,
    classes: runClasses,
    actions: runActions,
    sitemap: runSitemap,
    siteMetadata: runSiteMetadata,
    seo: runSEO || runPage,
    pages: runPages || runSlug,
    active: runActive || isActive,
    page: runPage || runClasses || runActions || runForms || runSEO,
  }
  if (Object.values(r).every((v) => v === false)) {
    if (hasChildren) return { ...data, children: sanitizeData(data.children) }
    else return data
  }

  // /////////////////////////////////////
  // Unset Active Processing
  // /////////////////////////////////////

  //When changing active status, due to draft and published may be different, will sometimes require running a processor again.
  if (r.active) {
    const unsetSlug = await unsetActive({ id, draft, req, slug })
    if (unsetSlug) {
      switch (unsetSlug) {
        case 'header':
        case 'footer':
          r.forms = true
          r.classes = true
          r.actions = true
          break
        case 'designSet':
        case 'shortcutSet':
          r.classes = true
          break
        default:
          break
      }
    }
  }

  // /////////////////////////////////////
  // Children Processing
  // /////////////////////////////////////

  const ABSP = new ActionBlockStorageProcessor()
  const classes = new Set<string>()
  const formMap = new Map<string, StoredAtomicForm>()
  const sd = sanitizeData(data) as CollectionBySlug<typeof slug> //Reduces impact of recursive data structure

  if (hasChildren && r.actions) {
    traverse(sd).forEach(function (node) {
      if (node && typeof node === 'object') ABSP.setKeyInitialValueByBlock({ node })
    })
  }

  if (hasChildren) {
    traverse(sd).forEach(function (node) {
      // Store Atomic Classes
      if (r.classes && this?.key?.endsWith('ClassName') && node) node.split(/\s+/).forEach((cls: string) => classes.add(cls.trim()))

      // Build Form Map
      if (r.forms && this.path && typeof node === 'object' && node?.type === 'form' && node.children) {
        const formData: StoredAtomicForm = { id: node.id, backendForm: node.backendForm, sm: node.sm, em: node.em }

        if (node.formSanitationBlocks) formData.sanitation = node.formSanitationBlocks
        if (node.formValidationBlocks) formData.validation = node.formValidationBlocks
        if (node.formRateLimitBlocks) formData.rateLimiting = node.formRateLimitBlocks

        formMap.set(this.path.join('.'), formData)
      }

      // Top Down Handling Goes Here
      this.before(function (node) {
        if (!node) return
        // Set Up Values For Actions
        if (r.actions && typeof node === 'object') ABSP.before({ node, path: this.path })
      })

      // Bottom Up Handling Goes Here
      this.after(function (node) {
        if (!node) return
        // Add Inputs to Form Map
        if (r.forms && this.path && typeof node === 'object' && node?.type === 'input') {
          const closestFormKey = findClosestParent(this.path, formMap.keys())
          if (closestFormKey) {
            const form = formMap.get(closestFormKey)
            if (form) {
              if (!form.inputs) form.inputs = []
              const inputData: StoredAtomicFormInput = { id: node.id, type: node.inputType, inputName: node.inputName }
              if (node.inputSanitationBlocks) inputData.sanitationBlocks = node.inputSanitationBlocks
              if (node.inputValidationBlocks) inputData.validationBlocks = node.inputValidationBlocks
              form.inputs.push(inputData)
            }
          }
        }

        // Add Actions To Blocks
        if (r.actions) ABSP.after({ node: node, path: this.path })

        if (node === undefined || node === null) throw new Error(`Processed Node Was Set To Undefined Or Null at path: ${this.path.join('.')}`)
        this.update(node, true)
      })
    })
  }

  // /////////////////////////////////////
  // Non Cache Dependent Data Processing
  // /////////////////////////////////////

  if ('children' in data && 'children' in sd) data.children = sd?.children

  if (r.classes) {
    if ('storedAtomicClasses' in data) {
      const classesArray = Array.from(classes)
      data.storedAtomicClasses = classesArray
      context.storedAtomicClasses = classesArray
      if (classesArray.length > 0)
        manualLogger(`[STORE] - Atomic Classes - ${data?.title || originalDoc?.id} - ${classesArray.length} Classes Stored`)
    }
    if (slug === 'designSet') processDesignSet(data as CollectionBySlug<'designSet'>) //Mutates data
    context[slug] = data as Extract<CollectionThatUsesCSSProcessor, { slug: typeof slug }>
  }

  if (r.forms) {
    if ('storedAtomicForms' in data) {
      const formsArray = Array.from(formMap.values())
      data.storedAtomicForms = formsArray
      context.storedAtomicForms = formsArray
    }
    if (formMap.size > 0) manualLogger(`[STORE] - Atomic Forms - ${data?.title || originalDoc?.id} - ${formMap.size} Forms Stored`)
  }

  if (r.actions) {
    const aa = ABSP.getAllActionBlocks()
    if ('storedAtomicActions' in data) {
      data.storedAtomicActions = aa
      context.storedAtomicActions = aa
    }
    if (aa) manualLogger(`[STORE] - Atomic Actions - ${data?.title || originalDoc?.id} - ${Object.keys(aa).length} Actions Stored`)
  }

  // /////////////////////////////////////
  // Revalidate Tags
  // /////////////////////////////////////

  if (r.sitemap) await revalidateTag('sitemap', draft)
  if (r.forms) await revalidateTag('atomic-forms', draft)
  if (r.actions) await revalidateTag('atomic-actions', draft)
  if (r.siteMetadata) await revalidateTag('site-metadata', draft)
  if (slug !== 'pages' && r.active) await revalidateTag(slug, draft)
  if (slug === 'pages' && r.classes) await revalidateTag('atomic-classes', draft)

  if (r.pages) await revalidateTag('pages', draft)
  if (r.page && href) await revalidateTag('page', href, draft)

  // /////////////////////////////////////
  // Cache Dependent Data Processing
  // /////////////////////////////////////
  if (r.classes && slug !== 'iconSet') {
    await cssProcessor({ slug, context, draft: true, req })
    if (!draft) await cssProcessor({ slug, context, draft: false, req })
  }
  return data
}
