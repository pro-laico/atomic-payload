'use client'
import { useMemo } from 'react'
import { type BlocksFieldClientProps } from 'payload'
import { ActionFilters } from '@/blocks/actions/filters'
import { useFormFields, BlocksField } from '@payloadcms/ui'
import { ActionBlockFilter, ActionBlockPrefix } from '@/ts/types/actions'
import { AtomicInputTypes, AtomicButtonTypes, AtomicButtonPortalTypes, ChildBlockType, AtomicChildVariants, ActionBlockType } from '@/ts/types'

interface ActionBlocksFieldProps extends BlocksFieldClientProps {
  placement: ActionBlockPrefix
}

const ActionBlocksField: React.FC<ActionBlocksFieldProps> = (props) => {
  const { path, field, placement } = props
  const p = useMemo(() => path.split('.').slice(0, -2).join('.'), [path])

  const type = useFormFields(([fields]) => fields[`${p}.type`]?.value as AtomicChildVariants | undefined)
  const blockType = useFormFields(([fields]) => fields[`${p}.blockType`]?.value as ChildBlockType | undefined)
  const inputType = useFormFields(([fields]) => fields[`${p}.inputType`]?.value as AtomicInputTypes | undefined)
  const buttonType = useFormFields(([fields]) => fields[`${p}.buttonType`]?.value as AtomicButtonTypes | undefined)
  const portalType = useFormFields(([fields]) => fields[`${p}.portalType`]?.value as AtomicButtonPortalTypes | undefined)

  const block = useMemo((): ActionBlockFilter => {
    const blockFilter: ActionBlockFilter = { placement, blockType: blockType || 'AtomicChild' }

    if (type) blockFilter.type = type
    if (inputType) blockFilter.inputType = inputType
    if (buttonType) blockFilter.buttonType = buttonType
    if (portalType) blockFilter.portalType = portalType

    return blockFilter
  }, [placement, type, blockType, inputType, buttonType, portalType])

  const filteredField = useMemo(() => {
    const blockRefs = field?.blockReferences?.filter((slug) => ActionFilters[slug as ActionBlockType](block))
    return { ...field, blocks: [], blockReferences: blockRefs }
  }, [field, block])

  return <BlocksField {...props} field={filteredField} />
}

ActionBlocksField.displayName = 'ActionBlocksField'

export default ActionBlocksField
