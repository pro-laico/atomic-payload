import { TextField } from 'payload'

type UniqueTitleFieldType = (defaultValue?: string) => TextField

export const UniqueTitleField: UniqueTitleFieldType = (defaultValue = 'New Title') => {
  const uniqueTitleField: TextField = { name: 'title', type: 'text', required: true, unique: true, defaultValue }
  return uniqueTitleField
}
