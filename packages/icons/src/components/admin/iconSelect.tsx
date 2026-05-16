import { SelectField } from '@payloadcms/ui'
import type { IconSetReturn } from '@pro-laico/core'
import type { SelectFieldServerComponent } from 'payload'

/** `getCached` from the app (e.g. `@/utilities/get/cache/react`). */
export type IconSelectGetCached = (
  tag: 'iconSet' | 'icon-options',
  draft: boolean,
  iconSet?: IconSetReturn | null | undefined,
) => Promise<unknown>

export function createIconSelect(getCached: IconSelectGetCached): SelectFieldServerComponent {
  return async function IconSelect({ clientField, path, schemaPath, permissions }) {
    const iconSet = (await getCached('iconSet', true)) as IconSetReturn | null | undefined
    const result = (await getCached('icon-options', true, iconSet)) as { label: string; value: string }[] | null | undefined

    if (!result) {
      console.warn('Icon options fetch failed')
      return (
        <SelectField field={{ ...clientField, options: [] }} path={path} schemaPath={schemaPath} permissions={permissions} />
      )
    }

    return (
      <SelectField field={{ ...clientField, options: result || [] }} path={path} schemaPath={schemaPath} permissions={permissions} />
    )
  }
}
