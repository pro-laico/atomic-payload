'use client'
import './index.scss'
import { useMemo } from 'react'
import { ShortcutSet } from '@/ts/types'
import { Pill, RowLabel, useRowLabel } from '@payloadcms/ui'

const ShortcutRowLabel = () => {
  const { data, path, rowNumber } = useRowLabel<ShortcutSet['shortcuts'][number]>()
  const { name } = data

  const namePills = useMemo(() => {
    if (!name) return null
    const namePieces = name.split('-')

    return namePieces.map((piece, index) => {
      return (
        <Pill className="shortcut-pill color-cycle" key={index} pillStyle="white" size="small">
          {piece}
        </Pill>
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, rowNumber])

  return <RowLabel path={path} rowNumber={rowNumber} label={namePills} />
}

ShortcutRowLabel.displayName = 'ShortcutRowLabel'

export default ShortcutRowLabel
