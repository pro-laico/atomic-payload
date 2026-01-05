import { UploadField } from 'payload'
import type { APFunction } from '@/ts/types'
import deepMerge from '@/utilities/deepMerge'
import { onUploadSetAPF } from '@/hooks/field/apf'

type FaviconFieldType = (args?: Partial<UploadField> & { apf?: APFunction[] }) => UploadField

const description = 'Sets the favicon for the site.'

export const FaviconField: FaviconFieldType = (args) => {
  const { apf, ...rest } = args || {}

  const faviconField: UploadField = { name: 'favicon', type: 'upload', relationTo: 'favicons', admin: { description } }

  if (args?.apf) faviconField.hooks = { beforeValidate: [onUploadSetAPF(args.apf)] }

  return deepMerge(faviconField, rest)
}
