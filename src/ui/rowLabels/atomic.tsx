'use client'
import React, { useMemo } from 'react'
import { AtomicChild, ChildBlocks } from '@/ts/types'
import { AtomicIcon } from '@/ui/assets/atomicIcon'
import { toTitleCase } from '@/utilities/format/toTitleCase'
import { Pill, RowLabel, useRowLabel, SectionTitle } from '@payloadcms/ui'

const countChildren = (children?: ChildBlocks, triggerChildren?: ChildBlocks): number => {
  let count = 0

  // Count immediate children
  if (children && children.length > 0) {
    count += children.length
    for (const child of children) {
      if (child.blockType === 'AtomicChild') {
        count += countChildren(child.children || [], child.triggerChildren || [])
      }
    }
  }

  // Also check triggerChildren if it exists
  if (triggerChildren && triggerChildren.length > 0) {
    count += triggerChildren.length
    for (const child of triggerChildren) {
      if (child.blockType === 'AtomicChild') {
        count += countChildren(child.children || [], child.triggerChildren || [])
      }
    }
  }

  return count
}

const AtomicRowLabel = () => {
  const { data, path, rowNumber } = useRowLabel<AtomicChild>()
  const { type, tagType, inputType, inputName, buttonType, backendForm, linkType, portalType, children, triggerChildren } = data || {}

  const childrenCount = useMemo(() => countChildren(children || [], triggerChildren || []), [children, triggerChildren])

  const typePill = useMemo(() => {
    if (type === 'tag' && tagType) return toTitleCase(tagType)
    if (type) return toTitleCase(type)
    return null
  }, [type, tagType])

  const elaborationPill = useMemo(() => {
    if (type === 'input' && inputType) return toTitleCase(inputType)
    if (type === 'button' && buttonType) return toTitleCase(buttonType)
    if (buttonType === 'link' && linkType) return toTitleCase(linkType)
    if (buttonType === 'portal' && portalType) return toTitleCase(portalType)
    return null
  }, [type, inputType, buttonType, linkType, portalType])

  const namePill = useMemo(() => {
    if (type === 'input' && inputName) return toTitleCase(inputName)
    if (type === 'form' && backendForm) return toTitleCase(backendForm)
    if (type === 'button' && buttonType === 'portal') return `${toTitleCase(portalType)}`
    return null
  }, [type, inputName, backendForm, portalType, buttonType])

  const childrenPill = useMemo(() => {
    if (childrenCount === 0) return null
    const childrenPill = childrenCount.toString()
    return `${childrenPill} ${childrenPill === '1' ? 'Child' : 'Children'}`
  }, [childrenCount])

  const formattedRowNumber = useMemo(() => String(rowNumber ?? 0).padStart(2, '0'), [rowNumber])

  return (
    <RowLabel
      path={path}
      rowNumber={rowNumber}
      label={
        <>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span>{formattedRowNumber}</span>
              <AtomicIcon type={type || 'fragment'} />
              <div style={{ display: 'flex', gap: '6px' }}>
                {typePill && (
                  <Pill pillStyle="white" size="small">
                    {typePill}
                  </Pill>
                )}
                {elaborationPill && (
                  <Pill pillStyle="white" size="small">
                    {elaborationPill}
                  </Pill>
                )}
                {namePill && (
                  <Pill pillStyle={type === 'input' ? 'success' : 'warning'} size="small">
                    {namePill}
                  </Pill>
                )}
              </div>
              <SectionTitle path={`${path}.blockName`} readOnly={false} />
            </div>
            <div>
              {childrenPill && (
                <Pill pillStyle="white" size="small">
                  {childrenPill}
                </Pill>
              )}
            </div>
          </div>
        </>
      }
    />
  )
}

AtomicRowLabel.displayName = 'AtomicRowLabel'

export default AtomicRowLabel
