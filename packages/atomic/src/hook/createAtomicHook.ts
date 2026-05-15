import { z } from '@pro-laico/zap'
import traverse from 'traverse'
import { runAPF } from '@pro-laico/ap-core'
import manualLogger from './utilities/manualLogger'
import sanitizeData from './utilities/sanitizeData'
import { revalidateTag } from '@pro-laico/ap-core'
import type { CollectionBeforeChangeHook } from 'payload'
import type { CollectionBySlug } from '@pro-laico/ap-core'
import type { CollectionThatUsesCSSProcessor } from '@pro-laico/atomic/hook'
import type { CollectionSlug } from 'payload'
import type { StoredAtomicForm, StoredAtomicFormInput } from '@pro-laico/atomic/forms/schema'
import { unsetActive } from './unsetActive'
import { createCssProcessor } from './cssProcessor'
import processDesignSet from './processDesignSet/index'
import type { CreateAtomicHookOptions } from './atomicHookTypes'

function findClosestParent(inputPath: string[], parentPaths: MapIterator<string>): string | null {
  const inputPathString = inputPath.join('.')
  let bestMatch = { length: 0, path: '' }

  for (const path of Array.from(parentPaths)) {
    if (inputPathString.startsWith(path) && path.length > bestMatch.length) bestMatch = { length: path.length, path }
  }
  return bestMatch.path || null
}

export function createAtomicHook({ getCached, ActionBlockStorageProcessor }: CreateAtomicHookOptions): CollectionBeforeChangeHook {
  const cssProcessor = createCssProcessor(getCached)

  return async ({ collection, context, data, originalDoc, operation, req }) => {
    if (context.isSeed) return
    const slug = z.ap.get('CollectionThatUsesAtomicHookSlug').parse(collection.slug)
    const draft = data?._status === 'draft'
    const isActive = Boolean(data?.active)
    const id = 'id' in originalDoc ? originalDoc?.id : undefined
    const hasChildren = 'children' in data && data?.children?.length > 0

    let href: string | undefined
    let runSlug = false
    if (slug === 'pages') {
      const previousHref = data?.href
      href =
        data?.breadcrumbs && data?.breadcrumbs?.length > 0
          ? data?.breadcrumbs[data?.breadcrumbs?.length - 1]?.url
          : undefined
      runSlug = operation !== 'create' ? (data?.slug !== originalDoc?.slug ? true : false) : Boolean(data?.live)
      if (operation !== 'create' && (previousHref !== href ? true : false)) await revalidateTag('page', previousHref!, draft)
    }

    const runSEO = runAPF({ context, id, apf: 'seo', data })
    const runPage = runAPF({ context, id, apf: 'page', data })
    const runForms = runAPF({ context, id, apf: 'form', data })
    const runPages = runAPF({ context, id, apf: 'pages', data })
    const runActive = runAPF({ context, id, apf: 'active', data })
    const runClasses = runAPF({ context, id, apf: 'classes', data })
    const runActions = runAPF({ context, id, apf: 'actions', data })
    const runSitemap = runAPF({ context, id, apf: 'sitemap', data })
    const runSiteMetadata = runAPF({ context, id, apf: 'siteMetadata', data })

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

    if (r.active) {
      const unsetSlug = await unsetActive({ id: id as string, draft, req, slug: slug as CollectionSlug })
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

    const ABSP = new ActionBlockStorageProcessor()
    const classes = new Set<string>()
    const formMap = new Map<string, StoredAtomicForm>()
    const sd = sanitizeData(data) as CollectionBySlug<typeof slug>

    if (hasChildren && r.actions) {
      traverse(sd).forEach(function (node) {
        if (node && typeof node === 'object') ABSP.setKeyInitialValueByBlock({ node })
      })
    }

    if (hasChildren) {
      traverse(sd).forEach(function (node) {
        if (r.classes && this?.key?.endsWith('ClassName') && node) (node as string).split(/\s+/).forEach((cls: string) => classes.add(cls.trim()))

        if (r.forms && this.path && typeof node === 'object' && node && 'type' in node && node.type === 'form' && 'children' in node && node.children) {
          const formData: StoredAtomicForm = {
            id: node.id as string,
            backendForm: node.backendForm as StoredAtomicForm['backendForm'],
            sm: node.sm as string | undefined,
            em: node.em as string | undefined,
          }

          if ('formSanitationBlocks' in node && node.formSanitationBlocks) formData.sanitation = node.formSanitationBlocks as StoredAtomicForm['sanitation']
          if ('formValidationBlocks' in node && node.formValidationBlocks) formData.validation = node.formValidationBlocks as StoredAtomicForm['validation']
          if ('formRateLimitBlocks' in node && node.formRateLimitBlocks) formData.rateLimiting = node.formRateLimitBlocks as StoredAtomicForm['rateLimiting']

          formMap.set(this.path.join('.'), formData)
        }

        this.before(function (n) {
          if (!n) return
          if (r.actions && typeof n === 'object') ABSP.before({ node: n, path: this.path })
        })

        this.after(function (n) {
          if (!n) return
          if (r.forms && this.path && typeof n === 'object' && 'type' in n && n?.type === 'input') {
            const closestFormKey = findClosestParent(this.path, formMap.keys())
            if (closestFormKey) {
              const form = formMap.get(closestFormKey)
              if (form) {
                if (!form.inputs) form.inputs = []
                const inputData: StoredAtomicFormInput = {
                  id: n.id as string,
                  type: n.inputType as StoredAtomicFormInput['type'],
                  inputName: n.inputName as string,
                }
                if ('inputSanitationBlocks' in n && n.inputSanitationBlocks) inputData.sanitationBlocks = n.inputSanitationBlocks as StoredAtomicFormInput['sanitationBlocks']
                if ('inputValidationBlocks' in n && n.inputValidationBlocks) inputData.validationBlocks = n.inputValidationBlocks as StoredAtomicFormInput['validationBlocks']
                form.inputs.push(inputData)
              }
            }
          }

          if (r.actions) ABSP.after({ node: n, path: this.path })

          if (n === undefined || n === null) throw new Error(`Processed Node Was Set To Undefined Or Null at path: ${this.path.join('.')}`)
          this.update(n, true)
        })
      })
    }

    if ('children' in data && 'children' in sd) data.children = sd?.children

    if (r.classes) {
      if ('storedAtomicClasses' in data) {
        const classesArray = Array.from(classes)
        data.storedAtomicClasses = classesArray
        context.storedAtomicClasses = classesArray
        if (classesArray.length > 0)
          manualLogger(`[STORE] - Atomic Classes - ${data?.title || originalDoc?.id} - ${classesArray.length} Classes Stored`)
      }
      if (slug === 'designSet') processDesignSet(data as CollectionBySlug<'designSet'>)
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

    if (r.sitemap) await revalidateTag('sitemap', draft)
    if (r.forms) await revalidateTag('atomic-forms', draft)
    if (r.actions) await revalidateTag('atomic-actions', draft)
    if (r.siteMetadata) await revalidateTag('site-metadata', draft)
    if (slug !== 'pages' && r.active) await revalidateTag(slug, draft)
    if (slug === 'pages' && r.classes) await revalidateTag('atomic-classes', draft)

    if (r.pages) await revalidateTag('pages', draft)
    if (r.page && href) await revalidateTag('page', href, draft)

    if (r.classes && slug !== 'iconSet') {
      await cssProcessor({ slug, context, draft: true, req })
      if (!draft) await cssProcessor({ slug, context, draft: false, req })
    }
    return data
  }
}
