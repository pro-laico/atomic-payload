import { authd } from '@/access/authenticated'
import { revalidateCache } from '@/hooks/collection/revalidate'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'

function insertFieldAtPosition<T>(fields: T[], field: T, position: number): T[] {
  return [...fields.slice(0, position), field, ...fields.slice(position)]
}

export const formBuilderPluginConfig = formBuilderPlugin({
  redirectRelationships: ['pages'],
  formSubmissionOverrides: {
    admin: { group: 'Forms', defaultColumns: ['form', 'submissionData', 'updatedAt'] },
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
