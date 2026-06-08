import 'server-only'

import { cache } from 'react'
import { type CollectionSlug, getPayload, type GlobalSlug, type Where } from 'payload'

import { getPayloadConfig } from '@pro-laico/core/config'
import { mt, withCache } from '@pro-laico/core/cache/primitives'
import type { AtomicStoreInitialState } from '@pro-laico/atomic/hook'
import type { ModifiedStoredAtomicForm } from '@pro-laico/atomic/forms'
import type { Form, FormSubmission, StoredAtomicForm } from '@pro-laico/atomic/forms/schema'

/** Stored atomic actions snapshot (version-gated) from the `settings` global. */
export const getCachedAtomicActions = cache(
  (draft: boolean): Promise<AtomicStoreInitialState> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        const draftPublished = draft ? 'draft' : 'published'
        const settings = (await payload.findGlobal({ slug: 'settings' as GlobalSlug })) as
          | { draft?: { storeVersion?: number }; published?: { storeVersion?: number } }
          | null
          | undefined
        return { version: settings?.[draftPublished]?.storeVersion || 0 }
      },
      { tag: 'atomic-actions', draft, extraTags: [mt(['settings', draft ? 'draft' : undefined])] },
    ),
)

/** Factory: bind the backend-forms getter to a forms collection slug. */
export const createGetCachedBackendForms =
  (formsSlug: string = 'forms') =>
  (): Promise<Form[]> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        return payload
          .find({ draft: false, collection: formsSlug as CollectionSlug, limit: 0, pagination: false })
          .then((res) => res.docs as unknown as Form[])
      },
      { tag: 'backend-forms' },
    )

/** Every backend form. */
export const getCachedBackendForms = cache(createGetCachedBackendForms())

/** Factory: bind the atomic-forms getter to a pages collection slug. */
export const createGetCachedAtomicForms =
  (pagesSlug: string = 'pages') =>
  (draft: boolean): Promise<StoredAtomicForm[]> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        const where: Where = { storedAtomicForms: { exists: true } }
        if (!draft) Object.assign(where, { live: { equals: true } })
        return payload
          .find({
            draft,
            collection: pagesSlug as CollectionSlug,
            limit: 0,
            pagination: false,
            where,
            select: { storedAtomicForms: true } as Parameters<typeof payload.find>[0]['select'],
          })
          .then((res) =>
            res.docs
              .map((doc) => (doc as { storedAtomicForms?: StoredAtomicForm[] }).storedAtomicForms)
              .filter(Boolean)
              .flat()
              .filter((form): form is StoredAtomicForm => form !== undefined),
          )
      },
      { tag: 'atomic-forms', draft },
    )

/** Every stored atomic form across page-like docs. */
export const getCachedAtomicForms = cache(createGetCachedAtomicForms())

/** Merge atomic forms with their backend form ids. Used by atomic-blocks dynamic form submission. */
export const getCachedAllForms = cache(
  (draft: boolean, atomicForms: StoredAtomicForm[], backendForms: Form[]): Promise<ModifiedStoredAtomicForm[]> =>
    withCache(
      async () =>
        atomicForms.map((atomicForm) => {
          const matchingForm = backendForms.find((form) => form.title === atomicForm.backendForm)
          return { ...atomicForm, backendFormID: matchingForm ? matchingForm.id : '' }
        }) as unknown as ModifiedStoredAtomicForm[],
      { tag: 'all-forms', draft, extraTags: [mt(['backend-forms']), mt(['atomic-forms', draft ? 'draft' : undefined])] },
    ),
)

/** Submissions for a form, matched by form title. */
export const getCachedFormSubmissions = cache(
  (tid: string): Promise<FormSubmission[]> =>
    withCache(
      async () => {
        const payload = await getPayload({ config: getPayloadConfig() })
        return payload
          .find({ collection: 'form-submissions' as CollectionSlug, limit: 0, depth: 0, pagination: false, where: { 'form.title': { equals: tid } } })
          .then((res) => res.docs as unknown as FormSubmission[])
      },
      { tag: 'form-submissions', tid, extraTags: [mt(['backend-forms'])] },
    ),
)
