'use client'
import './index.scss'
import { getTranslation } from '@payloadcms/translations'
import { CheckboxInput, FieldDescription, ReactSelect, TextareaInput, TextInput, useField, useFormFields } from '@payloadcms/ui'
import { FieldError } from '@payloadcms/ui/fields/FieldError'
import { formatOptions, SelectInput } from '@payloadcms/ui/fields/Select'
import { fieldBaseClass } from '@payloadcms/ui/fields/shared'
import { useTranslation } from '@payloadcms/ui/providers/Translation'
import type React from 'react'
import { memo, useEffect, useMemo, useState } from 'react'

import { apfRegistry } from '../../fields/storage'
import type { APFFieldComponentType } from '../../types'
import APFieldLabelServer from './label'
import { toKebabCase } from './toKebabCase'

/** Mirrors Payload `@payloadcms/ui` `mergeFieldStyles` widths for arbitrary field shapes used by AP fields. */
function mergeApfFieldStyles(
  field:
    | {
        admin?: {
          style?: React.CSSProperties
          width?: string | number | undefined
        }
      }
    | undefined,
): React.CSSProperties {
  const admin = field?.admin
  const style = admin?.style
  return {
    ...(style ?? {}),
    ...(admin?.width ? { '--field-width': `${admin.width}` } : { flex: '1 1 auto' }),
    ...(style?.flex !== undefined ? { flex: style.flex } : {}),
  } as React.CSSProperties
}

/** Accepts typed strings coming from react-select creatable filtering. */
function isNumericRawInput(raw: unknown): raw is string {
  if (typeof raw !== 'string' || raw.trim() === '') return false
  const n = Number(raw)
  return Number.isFinite(n)
}

export const APFieldComponent: APFFieldComponentType = (props) => {
  const { path, field, apf, type } = props
  const { i18n, t } = useTranslation()

  const { value, initialValue, setValue, selectFilterOptions, showError, disabled: formBusy } = useField<unknown>({ path })

  const targetPaths = useMemo(() => {
    const apfArray = Array.isArray(apf) ? apf : [apf]
    return apfArray?.map((apfItem) => apfRegistry[apfItem])
  }, [apf])

  const setTargetValues = useFormFields(([, dispatch]) => (value: boolean) => {
    targetPaths?.forEach((targetPath) => {
      dispatch({ type: 'UPDATE', path: targetPath, value })
    })
  })

  const selectFormattedOptions = useMemo(() => {
    if (type !== 'select') return []
    return formatOptions((field as Extract<typeof props, { type: 'select' }>['field']).options ?? [])
  }, [field, type])

  const placeholderNumber = useMemo(() => {
    if (type !== 'number') return undefined
    const raw = (props as Extract<typeof props, { type: 'number' }>).field?.admin?.placeholder
    if (raw === undefined || raw === null) return undefined
    const out = getTranslation(raw as Parameters<typeof getTranslation>[0], i18n)
    return typeof out === 'string' ? out : undefined
  }, [i18n, props, type])

  const [numberMultiRender, setNumberMultiRender] = useState<
    Array<{ id: string; label: string; value: { toString: () => string; value: number | undefined } }>
  >([])

  const hasManyNumber = type === 'number' && !!(field as { hasMany?: boolean }).hasMany
  const valueArray = useMemo(() => (Array.isArray(value) ? value : []), [value])
  useEffect(() => {
    if (!hasManyNumber) return
    setNumberMultiRender(
      valueArray.map((valEntry, index) => {
        const val_0 = valEntry as { value?: unknown } | number | string | null
        const v =
          typeof val_0 === 'object' && val_0 !== null && 'value' in val_0 ? (val_0 as { value: number }).value : (val_0 as number | null | undefined)
        const n = v == null || Number.isNaN(Number(v)) ? undefined : Number(v)
        return {
          id: `${String(n ?? '')}${index}`,
          label: `${n ?? ''}`,
          value: {
            toString: () => `${String(n ?? '')}${index}`,
            value: n,
          },
        }
      }),
    )
  }, [hasManyNumber, valueArray])

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

  function handleChange(next: unknown) {
    setValue(next)
    if (next !== initialValue) setTargetValues(true)
  }

  const selectFilterMemo = useMemo(() => {
    if (!selectFilterOptions) return undefined
    return (opt: { label: string; value: unknown }, search: string) =>
      !!selectFilterOptions.some((optionEl) => (typeof optionEl === 'string' ? optionEl : optionEl.value) === opt.value) &&
      opt.label.toLowerCase().includes(search.toLowerCase())
  }, [selectFilterOptions])

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
    case 'select': {
      const sel = props as Extract<typeof props, { type: 'select' }>
      const selField = sel.field
      const readOnlySel = !!(selField?.admin?.readOnly || formBusy)
      const adm = selField.admin
      const isClearable = adm?.isClearable !== false
      const isSortable = adm?.isSortable !== false
      fieldComponent = (
        <SelectInput
          className={adm?.className}
          hasMany={selField?.hasMany}
          isClearable={isClearable}
          isSortable={isSortable}
          label={undefined}
          filterOption={selectFilterMemo}
          localized={selField?.localized}
          name={selField?.name ?? path}
          options={selectFormattedOptions}
          path={path}
          placeholder={adm?.placeholder as React.ComponentProps<typeof SelectInput>['placeholder']}
          readOnly={readOnlySel}
          required={selField.required === true}
          style={mergeApfFieldStyles(selField)}
          showError={showError}
          value={(value ?? null) as string | string[] | undefined}
          onChange={(selectedOption) => {
            const hasMany = !!selField?.hasMany
            let next: string | string[] | null = null
            if (selectedOption && hasMany) {
              next = Array.isArray(selectedOption) ? selectedOption.map((option) => option.value as string) : []
            } else if (selectedOption && !Array.isArray(selectedOption)) {
              next = selectedOption.value as string
            }
            handleChange(next)
          }}
        />
      )
      break
    }
    case 'number': {
      const f = field as {
        admin?: {
          readOnly?: boolean
          style?: React.CSSProperties
          className?: string
          placeholder?: unknown
          step?: number
        }
        hasMany?: boolean
        localized?: boolean
        label?: unknown
        max?: number
        maxRows?: number
        min?: number
        required?: boolean
      }
      const adm = f?.admin ?? {}
      const readOnlyNum = !!(adm.readOnly || formBusy)
      const hasMany = !!f?.hasMany
      const step = adm.step ?? 1
      const max = typeof f?.max === 'number' ? f.max : Infinity
      const min = typeof f?.min === 'number' ? f.min : -Infinity
      const maxRows = typeof f?.maxRows === 'number' ? f.maxRows : Infinity

      const handleNumberScalarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = parseFloat(e.target.value)
        const nextVal = Number.isNaN(parsed) ? null : parsed
        handleChange(nextVal)
      }

      const handleHasManyNumberChange = (selectedOption: unknown) => {
        if (readOnlyNum) return
        let next: number[]
        if (!selectedOption) {
          next = []
        } else if (Array.isArray(selectedOption)) {
          next = selectedOption.map((option) =>
            Number((option as { value?: { value?: number } }).value?.value ?? (option as { value?: number }).value),
          )
        } else {
          next = [Number((selectedOption as { value?: { value?: number } }).value?.value ?? (selectedOption as { value?: number }).value)]
        }
        handleChange(next)
      }

      const numberRowClassName = [fieldBaseClass, 'number', adm.className, showError && 'error', readOnlyNum && 'read-only', hasMany && 'has-many']
        .filter(Boolean)
        .join(' ')

      fieldComponent = (
        <div className={numberRowClassName} style={mergeApfFieldStyles(f)}>
          <div className={`${fieldBaseClass}__wrap`}>
            <FieldError path={path} showError={showError} />
            {hasMany ? (
              <ReactSelect
                className={`field-${path.replace(/\./g, '__')}`}
                disabled={readOnlyNum}
                filterOption={
                  ((_opt, rawInput: string) => (valueArray.length >= maxRows ? false : isNumericRawInput(rawInput))) as React.ComponentProps<
                    typeof ReactSelect
                  >['filterOption']
                }
                isClearable
                isCreatable
                isMulti
                isSortable
                noOptionsMessage={() => {
                  const over = valueArray.length >= maxRows
                  if (over) {
                    return t('validation:limitReached', { max: maxRows, value: valueArray.length + 1 })
                  }
                  return ''
                }}
                onChange={handleHasManyNumberChange}
                options={[]}
                placeholder={placeholderNumber}
                showError={showError}
                value={numberMultiRender}
              />
            ) : (
              <div>
                <input
                  disabled={readOnlyNum}
                  id={`field-${path.replace(/\./g, '__')}`}
                  max={max}
                  min={min}
                  name={path}
                  onChange={handleNumberScalarChange}
                  onWheel={(e) => {
                    ;(e.target as HTMLInputElement).blur()
                  }}
                  placeholder={placeholderNumber}
                  step={step}
                  type="number"
                  value={typeof value === 'number' ? value : ''}
                />
              </div>
            )}
          </div>
        </div>
      )
      break
    }
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
