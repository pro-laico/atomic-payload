'use client'
import type React from 'react'
import { useCallback, useEffect } from 'react'

import type { TextFieldClientProps } from 'payload'
import { Button, FieldLabel, TextInput, useField, useForm, useFormFields } from '@payloadcms/ui'

import './index.scss'
import { formatSlug } from '../../../hooks/field/formatSlug'

type SlugComponentProps = { fieldToUse: string; checkboxFieldPath: string } & TextFieldClientProps

const SlugComponent: React.FC<SlugComponentProps> = ({
  path,
  field,
  fieldToUse,
  readOnly: readOnlyFromProps,
  checkboxFieldPath: checkboxFieldPathFromProps,
}) => {
  const { label } = field
  const { value, setValue } = useField<string>({ path: path || field.name })
  const { dispatchFields } = useForm()

  const checkboxFieldPath = path?.includes('.') ? `${path}.${checkboxFieldPathFromProps}` : checkboxFieldPathFromProps

  // The value of the checkbox
  // We're using separate useFormFields to minimise re-renders
  const checkboxValue = useFormFields(([fields]) => {
    return fields[checkboxFieldPath]?.value as string
  })

  // The value of the field we're listening to for the slug
  const targetFieldValue = useFormFields(([fields]) => {
    return fields[fieldToUse]?.value as string
  })

  const readOnly = readOnlyFromProps || checkboxValue

  useEffect(() => {
    if (checkboxValue) {
      if (targetFieldValue) {
        const formattedSlug = formatSlug(targetFieldValue)
        if (value !== formattedSlug) setValue(formattedSlug)
      } else {
        if (value !== '') setValue('')
      }
    }
  }, [targetFieldValue, checkboxValue, setValue, value])

  const handleLock = useCallback(
    (e: React.MouseEvent<Element>) => {
      e.preventDefault()

      dispatchFields({ type: 'UPDATE', path: checkboxFieldPath, value: !checkboxValue })
    },
    [checkboxValue, checkboxFieldPath, dispatchFields],
  )

  return (
    <div className="field-type slug-field-component">
      <div className="label-wrapper" style={field?.admin?.style}>
        <FieldLabel htmlFor={`field-${path}`} label={label} />

        <Button className="lock-button" buttonStyle="none" onClick={handleLock}>
          {checkboxValue ? 'Unlock' : 'Lock'}
        </Button>
      </div>

      <TextInput value={value} onChange={setValue} path={path || field.name} style={field?.admin?.style} readOnly={Boolean(readOnly)} />
    </div>
  )
}

export default SlugComponent
