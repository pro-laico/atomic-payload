'use client'
import { SimpleTextChild } from '@/ts/types'
import { Pill, RowLabel, useRowLabel, SectionTitle } from '@payloadcms/ui'

const TRUNCATE_LENGTH = 50
const TRUNCATE_SUFFIX = '...'

export const SimpleTextRowLabel = () => {
  const { data, path, rowNumber } = useRowLabel<SimpleTextChild>()
  const { text } = data

  let elaborationPill: string | null = null
  if (text) elaborationPill = text.length > TRUNCATE_LENGTH ? `"${text.slice(0, TRUNCATE_LENGTH)}${TRUNCATE_SUFFIX}"` : `"${text}"`

  const formattedRowNumber = String(rowNumber ?? 0).padStart(2, '0')

  return (
    <RowLabel
      path={path}
      rowNumber={rowNumber}
      label={
        <>
          <span>{formattedRowNumber}</span>
          <Pill pillStyle="white" size="small">
            Simple Text
          </Pill>
          {elaborationPill && (
            <Pill pillStyle="white" size="small">
              {elaborationPill}
            </Pill>
          )}
          <SectionTitle path={`${path}.blockName`} readOnly={false} />
        </>
      }
    />
  )
}

SimpleTextRowLabel.displayName = 'SimpleTextRowLabel'

export default SimpleTextRowLabel
