'use client'
import React from 'react'
import type { Icon } from '@pro-laico/ap-types/schema'
import { Pill, RowLabel, useRowLabel } from '@payloadcms/ui'

interface IconData {
  name: string
  icon: string | Icon
}

function toTitleCase(input?: string | null): string {
  if (!input) return ''
  let s = input.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  s = s
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/[.\s]+/g, ' ')
  const words = s.split(/\s+/).filter((w) => w.length > 0)
  if (words.length === 0) return ''
  return words
    .map((w) => (/^[A-Z]+$/.test(w) ? w : /^[A-Z][a-z]+$/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(' ')
    .trim()
}

const IconRowLabel = () => {
  const { data, path, rowNumber } = useRowLabel<IconData>()

  return (
    <RowLabel
      path={path}
      rowNumber={rowNumber}
      label={
        <>
          <span>{rowNumber}</span>
          <Pill pillStyle="white" size="small">
            {toTitleCase(data?.name) || 'Add Name'}
          </Pill>
        </>
      }
    />
  )
}

IconRowLabel.displayName = 'IconRowLabel'

export default IconRowLabel
