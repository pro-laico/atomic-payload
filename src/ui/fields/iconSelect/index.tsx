'use server'
import type React from 'react'
import { SelectField } from '@payloadcms/ui'
import getCached from '@/utilities/get/cache/react'
import type { SelectFieldServerComponent } from 'payload'

const IconSelect: SelectFieldServerComponent = async ({ clientField, path, schemaPath, permissions }) => {
  const iconSet = await getCached('iconSet', true)
  const result = await getCached('icon-options', true, iconSet)

  if (!result) {
    console.warn('Icon options fetch failed')
    return <SelectField field={{ ...clientField, options: [] }} path={path} schemaPath={schemaPath} permissions={permissions} />
  }

  return <SelectField field={{ ...clientField, options: result || [] }} path={path} schemaPath={schemaPath} permissions={permissions} />
}

export default IconSelect
