'use client'
import { useMemo } from 'react'
import { AtomicInputTypes } from '@/ts/types'
import { useFormFields, BlocksField } from '@payloadcms/ui'
import { type InputBlocksFieldProps } from '@/ts/types'

const InputBlocksField: React.FC<InputBlocksFieldProps> = (props) => {
  const { path, field, usedOn } = props
  const p = useMemo(() => path.split('.').slice(0, -1).join('.'), [path])

  const inputType = useFormFields(([fields]) => fields[`${p}.inputType`]?.value as AtomicInputTypes | undefined)

  const filteredField = useMemo(() => {
    if (!inputType) return { ...field, blocks: [], blockReferences: [] }
    const inputTypes = field.blockReferences?.filter((ref) => usedOn?.some(({ block, usedOn }) => block === ref && usedOn?.includes(inputType)))
    return { ...field, blocks: [], blockReferences: inputTypes }
  }, [field, usedOn, inputType])

  return <BlocksField {...props} field={filteredField} />
}

InputBlocksField.displayName = 'InputBlocksField'

export default InputBlocksField
