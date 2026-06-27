import type { UploadField } from 'payload'
import { onUploadSetAPF } from '@pro-laico/core'
import type { APFunction } from '@pro-laico/core'

type FaviconFieldType = (args?: Partial<UploadField> & { apf?: APFunction[] }) => UploadField

const description = 'Sets the favicon for the site.'

function isObject(item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null && !Array.isArray(item)
}

function deepMerge<T, R>(target: T, source: R): T {
  const output = { ...(target as object) } as Record<string, unknown> //TODO: replace `as` cast with proper typing
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sv = (source as Record<string, unknown>)[key] //TODO: replace `as` cast with proper typing
      if (isObject(sv)) {
        if (!(key in (target as object)))
          Object.assign(output, { [key]: sv }) //TODO: replace `as` cast with proper typing
        else output[key] = deepMerge((target as Record<string, unknown>)[key], sv) //TODO: replace `as` cast with proper typing
      } else Object.assign(output, { [key]: sv })
    })
  }
  return output as T //TODO: replace `as` cast with proper typing
}

export const FaviconField: FaviconFieldType = (args) => {
  const { apf, ...rest } = args || {}

  const faviconField: UploadField = { name: 'favicon', type: 'upload', relationTo: 'favicons', admin: { description } }

  if (apf) faviconField.hooks = { beforeValidate: [onUploadSetAPF(apf)] }

  const merged = deepMerge(faviconField, rest)
  return { ...merged, type: 'upload', relationTo: 'favicons' }
}
