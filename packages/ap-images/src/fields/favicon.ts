import type { UploadField } from 'payload'
import type { APFunction } from '@pro-laico/ap-apf'
import { onUploadSetAPF } from '@pro-laico/ap-apf'

type FaviconFieldType = (args?: Partial<UploadField> & { apf?: APFunction[] }) => UploadField

const description = 'Sets the favicon for the site.'

function isObject(item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null && !Array.isArray(item)
}

function deepMerge<T, R>(target: T, source: R): T {
  const output = { ...(target as object) } as Record<string, unknown>
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sv = (source as Record<string, unknown>)[key]
      if (isObject(sv)) {
        if (!(key in (target as object))) Object.assign(output, { [key]: sv })
        else output[key] = deepMerge((target as Record<string, unknown>)[key], sv)
      } else Object.assign(output, { [key]: sv })
    })
  }
  return output as T
}

export const FaviconField: FaviconFieldType = (args) => {
  const { apf, ...rest } = args || {}

  const faviconField: UploadField = { name: 'favicon', type: 'upload', relationTo: 'favicons', admin: { description } }

  if (apf) faviconField.hooks = { beforeValidate: [onUploadSetAPF(apf)] }

  return deepMerge(faviconField, rest)
}
