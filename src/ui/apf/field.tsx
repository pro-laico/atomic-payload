'use client'
import './index.scss'
import APFieldLabelServer from './label'
import React, { memo, useMemo } from 'react'
import { apfRegistry } from '@/fields/apf/storage'
import type { APFFieldComponentType } from '@/ts/types'
import { toKebabCase } from '@/utilities/format/toKebabCase'
import { useField, useFormFields, NumberField, TextInput, TextareaInput, CheckboxInput, SelectField, FieldDescription } from '@payloadcms/ui'

export const APFieldComponent: APFFieldComponentType = (props) => {
  const { path, field, apf, type } = props

  const { value, initialValue, setValue } = useField<unknown>({ path })

  const targetPaths = useMemo(() => {
    const apfArray = Array.isArray(apf) ? apf : [apf]
    return apfArray?.map((apfItem) => apfRegistry[apfItem])
  }, [apf])

  const setTargetValues = useFormFields(([, dispatch]) => (value: boolean) => {
    targetPaths?.forEach((targetPath) => dispatch({ type: 'UPDATE', path: targetPath, value }))
  })

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (type === 'text' || type === 'textarea') {
      const { kebab } = props
      let tempValue = e.target.value
      if (kebab) tempValue = toKebabCase(tempValue)
      setValue(tempValue)
      setTargetValues(true)
    }
    if (value !== initialValue) setTargetValues(true)
  }

  function handleChange(value: unknown) {
    setValue(value)
    if (value !== initialValue) setTargetValues(true)
  }

  let fieldComponent = null
  switch (type) {
    case 'text':
      fieldComponent = (
        <TextInput path={path} style={field?.admin?.style} readOnly={field?.admin?.readOnly} value={value as string} onChange={handleTextChange} />
      )
      break
    case 'textarea':
      fieldComponent = (
        <TextareaInput
          path={path}
          style={field?.admin?.style}
          readOnly={field?.admin?.readOnly}
          value={value as string}
          onChange={handleTextChange}
        />
      )
      break
    case 'checkbox':
      fieldComponent = (
        <CheckboxInput checked={value as boolean} readOnly={field?.admin?.readOnly} onToggle={() => handleChange(!value)} id={`field-${path}`} />
      )
      break
    case 'select':
      return <SelectField value={value as string} readOnly={field?.admin?.readOnly} field={field} onChange={handleChange} path={path} />
    case 'number':
      return <NumberField readOnly={field?.admin?.readOnly} field={field} onChange={handleChange} path={path} />
    default:
      console.warn('Missing Field Component With Type: ', type)
      fieldComponent = <div> Missing Field Component </div>
  }

  return (
    <div className={`field-type ${type}`}>
      <APFieldLabelServer {...props} />
      {fieldComponent}
      {field?.admin?.description && <FieldDescription description={field.admin.description} path={path} />}
    </div>
  )
}

export default memo(APFieldComponent)
