import type { UploadField } from 'payload'

import { onUploadSetAPF } from '@pro-laico/core'
import type { APFunction } from '@pro-laico/core'

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

  // Callers legitimately override `name`/`admin`/`hooks` (e.g. to mount several
  // favicon pickers), but the field's identity — `type: 'upload'` targeting the
  // `favicons` collection — is re-asserted after the merge so a stray override
  // can't silently re-target the picker at another collection.
  const merged = deepMerge(faviconField, rest)
  return { ...merged, type: 'upload', relationTo: 'favicons' }
}
