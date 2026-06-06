import { authd } from '@/access/authenticated'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'

// Revalidation on `forms` / `form-submissions` is wired by `pluginComposer`'s
// finalizer (see ./index), which runs last and attaches the revalidation
// dispatchers to every collection, so no per-collection
// `beforeChange: [revalidateCache]` is needed here.
function insertFieldAtPosition<T>(fields: T[], field: T, position: number): T[] {
  return [...fields.slice(0, position), field, ...fields.slice(position)]
}

export const formBuilderPluginConfig = formBuilderPlugin({
  redirectRelationships: ['pages'],
  formSubmissionOverrides: {
    admin: { group: 'Forms', defaultColumns: ['form', 'submissionData', 'updatedAt'] },
    // Deny public REST `create` — the ONLY write path is the `submitForm` server
    // action, which runs the validation/rate-limit/sanitation pipeline and writes
    // via the Local API with `overrideAccess: true`. Read/update/delete stay
    // authenticated since submissions can hold PII.
    access: { create: () => false, delete: authd, read: authd, update: authd },
  },
  fields: {
    select: false,
    email: false,
    state: false,
    country: false,
    checkbox: false,
    number: false,
    message: false,
    date: false,
    payment: false,
    radio: false,
  },
  formOverrides: {
    slug: 'forms',
    admin: { group: 'Forms' },
    access: { read: authd, update: authd },
    labels: { singular: 'Backend Form', plural: 'Backend Forms' },
    fields: ({ defaultFields }) => {
      const fieldsToRemove = ['submitButtonLabel', 'confirmationType', 'confirmationMessage', 'redirect', 'fields']
      const filteredFields = defaultFields.filter((field: any) => !fieldsToRemove.includes(field?.name))
      const updatedFields = insertFieldAtPosition(filteredFields, { type: 'group', fields: [] }, 2)
      return [...updatedFields]
    },
  },
})
