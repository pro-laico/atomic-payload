'use client'
import { Pill, RowLabel, SectionTitle, useRowLabel } from '@payloadcms/ui'

const AnimationRowLabel = () => {
  const { data, path, rowNumber } = useRowLabel<{ [key: string]: string }>()
  const formattedRowNumber = String(rowNumber ?? 0).padStart(2, '0')

  return (
    <RowLabel
      path={path}
      rowNumber={rowNumber}
      label={
        <>
          <span>{formattedRowNumber}</span>
          <Pill pillStyle="white" size="small">
            {data?.name}
          </Pill>
          <SectionTitle path={`${path}.name`} readOnly={true} />
        </>
      }
    />
  )
}

AnimationRowLabel.displayName = 'AnimationRowLabel'

export default AnimationRowLabel
