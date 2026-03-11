'use server'
import 'server-only' //DO NOT REMOVE
import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import cacheLogger from '@/utilities/log/cache'
import { Form, GCFunction, StoredAtomicForm } from '@/ts/types'

/** Gets all backend forms stored in the forms collection. */
export const getCachedBackendForms: GCFunction<'backend-forms'> = async (tag) => {
  const payload = await getPayload({ config: configPromise })
  const results = await payload.find({ draft: false, collection: 'forms', limit: 1000, pagination: false }).then((res) => res.docs.map((doc) => doc))
  cacheLogger({ tag })
  return results
}

/** Gets all atomic forms stored in the pages collection. */
export const getCachedAtomicForms: GCFunction<'atomic-forms'> = async (tag, draft) => {
  const payload = await getPayload({ config: configPromise })
  const where: Where = { storedAtomicForms: { exists: true } }
  if (!draft) Object.assign(where, { live: { equals: true } })
  const results = await payload.find({ draft, collection: 'pages', limit: 1000, where, select: { storedAtomicForms: true } }).then((res) =>
    res.docs
      .map((doc) => doc.storedAtomicForms)
      .filter(Boolean)
      .flat()
      .filter((form): form is StoredAtomicForm => form !== undefined),
  )

  cacheLogger({ tag, draft })
  return results
}

/** Used in Atomic Blocks Dynamic Form Submission Only */
export const getCachedAllForms: GCFunction<'all-forms'> = async (tag, draft, atomicForms, backendForms) => {
  // Add id from forms to atomicForms by matching backendForm
  const mergedAtomicForms = atomicForms.map((atomicForm: StoredAtomicForm) => {
    const matchingForm = backendForms.find((form: Form) => form.title === atomicForm.backendForm)
    return { ...atomicForm, backendFormID: matchingForm ? matchingForm.id : '' }
  })

  cacheLogger({ tag, draft })
  return mergedAtomicForms
}
