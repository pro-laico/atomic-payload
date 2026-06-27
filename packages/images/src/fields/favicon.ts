import type { UploadField } from 'payload'
import { deepMerge, onUploadSetAPF } from '@pro-laico/core'
import type { APFunction } from '@pro-laico/core'

type FaviconFieldType = (args?: Partial<UploadField> & { apf?: APFunction[] }) => UploadField

const description = 'Sets the favicon for the site.'

export const FaviconField: FaviconFieldType = (args) => {
  const { apf, ...rest } = args || {}

  const faviconField: UploadField = { name: 'favicon', type: 'upload', relationTo: 'favicons', admin: { description } }

  if (apf) faviconField.hooks = { beforeValidate: [onUploadSetAPF(apf)] }

  const merged = deepMerge(faviconField, rest)
  return { ...merged, type: 'upload', relationTo: 'favicons' }
}
