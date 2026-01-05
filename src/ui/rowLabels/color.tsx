'use client'
import { useRowLabel, RowLabel, Pill } from '@payloadcms/ui'
import { toTitleCase } from '@/utilities/format/toTitleCase'

const ColorRowLabel = () => {
  const { data, path, rowNumber } = useRowLabel<{ [key: string]: string }>()
  const { name, light, dark } = data

  const formattedRowNumber = String(rowNumber ?? 0).padStart(2, '0')

  return (
    <RowLabel
      path={path}
      rowNumber={rowNumber}
      label={
        <>
          <span>{formattedRowNumber}</span>
          {light && <div style={{ width: '40px', height: '20px', backgroundColor: light, display: 'inline-block', flexShrink: 0 }} />}
          {dark && <div style={{ width: '40px', height: '20px', backgroundColor: dark, display: 'inline-block', flexShrink: 0 }} />}
          {name && (
            <Pill pillStyle="white" size="small">
              {toTitleCase(name)}
            </Pill>
          )}
        </>
      }
    />
  )
}

ColorRowLabel.displayName = 'ColorRowLabel'

export default ColorRowLabel
