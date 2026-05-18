'use client'
import { BlocksField, useFormFields } from '@payloadcms/ui'
import type { ActionBlockFilter, ActionBlockPrefix } from '@pro-laico/atomic/actions'
import { ActionFilters } from '@pro-laico/atomic/actions/filters'
import type {
  AtomicButtonPortalTypes,
  AtomicButtonTypes,
  AtomicChildVariants,
  AtomicInputTypes,
} from '@pro-laico/atomic/actions/schema'
import type { ChildBlockType } from '@pro-laico/atomic/children/schema'
import type { BlocksFieldClientProps } from 'payload'
import { useMemo } from 'react'

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
    const blockRefs = field?.blockReferences?.filter((slug) => ActionFilters[slug as keyof typeof ActionFilters](block))
    return { ...field, blocks: [], blockReferences: blockRefs }
  }, [field, block])

  return <BlocksField {...props} field={filteredField} />
}

ActionBlocksField.displayName = 'ActionBlocksField'

export default ActionBlocksField
