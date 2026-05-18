'use client'
import './index.scss'
import { Pill, RowLabel, useRowLabel } from '@payloadcms/ui'
import type { ShortcutSet } from '@pro-laico/site/schema'
import { useMemo } from 'react'

const ShortcutRowLabel = () => {
  const { data, path, rowNumber } = useRowLabel<ShortcutSet['shortcuts'][number]>()
  const { name } = data

  const namePills = useMemo(() => {
    if (!name) return null
    const namePieces = name.split('-')

    return namePieces.map((piece: string, index: number) => {
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
