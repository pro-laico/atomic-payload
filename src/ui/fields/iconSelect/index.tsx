'use server'
import type React from 'react'
import { SelectField } from '@payloadcms/ui'
import getCached from '@/utilities/get/cache'
import type { SelectFieldServerComponent } from 'payload'

const IconSelect: SelectFieldServerComponent = async ({ clientField, path, schemaPath, permissions }) => {
  const iconSet = await getCached({ tag: 'iconSet', draft: true })
  const result = await getCached({ tag: 'icon-options', draft: true, iconSet })

  if (!result) {
    console.warn('Icon options fetch failed')
    return <SelectField field={{ ...clientField, options: [] }} path={path} schemaPath={schemaPath} permissions={permissions} />
  }

  return <SelectField field={{ ...clientField, options: result || [] }} path={path} schemaPath={schemaPath} permissions={permissions} />
}

export default IconSelect
