import { TextField } from 'payload'
import deepMerge from '@/utilities/deepMerge'

const description = 'The name of the input this label is associated with.'

type ForFieldType = (args?: Partial<TextField>) => TextField

export const ForField: ForFieldType = (args) => {
  const forField: TextField = { name: 'htmlFor', type: 'text', label: 'HTML For', admin: { description } }
  return deepMerge(forField, args)
}
