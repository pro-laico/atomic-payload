'use client'

import { useMemo } from 'react'
import { Pill, RowLabel, useRowLabel } from '@payloadcms/ui'

import type { ShortcutSet } from '../../../types/payload-augment'

import './index.scss'

const ShortcutRowLabel = () => {
  const { data, path, rowNumber } = useRowLabel<ShortcutSet['shortcuts'][number]>()
  const { name } = data

  const namePills = useMemo(() => {
    if (!name) return null
    const namePieces = name.split('-')

    return namePieces.map((piece: string, index: number) => {
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: pieces can repeat (e.g. "foo-foo"); index disambiguates, and this label list never reorders.
        <Pill className="shortcut-pill color-cycle" key={`${index}-${piece}`} pillStyle="white" size="small">
          {piece}
        </Pill>
      )
    })
  }, [name])

  return <RowLabel path={path} rowNumber={rowNumber} label={namePills} />
}

ShortcutRowLabel.displayName = 'ShortcutRowLabel'

export default ShortcutRowLabel
