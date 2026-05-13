import type { TextField } from 'payload'

type UniqueTitleFieldType = (defaultValue?: string) => TextField

export const UniqueTitleField: UniqueTitleFieldType = (defaultValue = 'New Title') => ({
  name: 'title',
  type: 'text',
  required: true,
  unique: true,
  defaultValue,
})
