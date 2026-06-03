import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { revalidateCacheCollection as revalidateCache } from '@pro-laico/core'

import { authd } from '@/access/authenticated'

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
    hooks: { beforeChange: [revalidateCache] },
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
    hooks: { beforeChange: [revalidateCache] },
    labels: { singular: 'Backend Form', plural: 'Backend Forms' },
    fields: ({ defaultFields }) => {
      const fieldsToRemove = ['submitButtonLabel', 'confirmationType', 'confirmationMessage', 'redirect', 'fields']
      const filteredFields = defaultFields.filter((field: any) => !fieldsToRemove.includes(field?.name))
      const updatedFields = insertFieldAtPosition(filteredFields, { type: 'group', fields: [] }, 2)
      return [...updatedFields]
    },
  },
})
