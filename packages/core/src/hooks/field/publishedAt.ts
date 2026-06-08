import type { FieldHook } from 'payload'

export const updatePublishedAtHook: FieldHook = ({ operation }) => {
  if (operation === 'update') return new Date()
}
