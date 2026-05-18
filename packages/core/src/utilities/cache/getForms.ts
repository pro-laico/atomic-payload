'use server'
import 'server-only' //DO NOT REMOVE
import type { Form, StoredAtomicForm } from '@pro-laico/atomic/forms/schema'
import { type CollectionSlug, getPayload, type Where } from 'payload'
import type { GCFunction } from '../../types/cache'
import cacheLogger from '../cacheLogger'

/** Factory: pass the slug of the backend forms collection. */
export const createGetCachedBackendForms = (formsSlug: string = 'forms'): GCFunction<'backend-forms'> => {
  const collection = formsSlug as CollectionSlug
  return async (configPromise, tag) => {
    const payload = await getPayload({ config: configPromise })
    const results = await payload.find({ draft: false, collection, limit: 1000, pagination: false }).then((res) => res.docs.map((doc) => doc))
    cacheLogger({ tag })
    return results
  }
}

/** Factory: pass the slug of the pages collection to scan for atomic forms. */
export const createGetCachedAtomicForms = (pagesSlug: string = 'pages'): GCFunction<'atomic-forms'> => {
  const collection = pagesSlug as CollectionSlug
  return async (configPromise, tag, draft) => {
    const payload = await getPayload({ config: configPromise })
    const where: Where = { storedAtomicForms: { exists: true } }
    if (!draft) Object.assign(where, { live: { equals: true } })
    const results = await payload
      .find({ draft, collection, limit: 1000, where, select: { storedAtomicForms: true } as Parameters<typeof payload.find>[0]['select'] })
      .then((res) =>
        res.docs
          .map((doc) => (doc as { storedAtomicForms?: StoredAtomicForm[] }).storedAtomicForms)
          .filter(Boolean)
          .flat()
          .filter((form): form is StoredAtomicForm => form !== undefined),
      )

    cacheLogger({ tag, draft })
    return results
  }
}

export const getCachedBackendForms: GCFunction<'backend-forms'> = createGetCachedBackendForms()
export const getCachedAtomicForms: GCFunction<'atomic-forms'> = createGetCachedAtomicForms()

/** Used in Atomic Blocks Dynamic Form Submission Only */
export const getCachedAllForms: GCFunction<'all-forms'> = async (_configPromise, tag, draft, atomicForms, backendForms) => {
  // Add id from forms to atomicForms by matching backendForm
  const mergedAtomicForms = atomicForms.map((atomicForm: StoredAtomicForm) => {
    const matchingForm = backendForms.find((form: Form) => form.title === atomicForm.backendForm)
    return { ...atomicForm, backendFormID: matchingForm ? matchingForm.id : '' }
  })

  cacheLogger({ tag, draft })
  return mergedAtomicForms
}
