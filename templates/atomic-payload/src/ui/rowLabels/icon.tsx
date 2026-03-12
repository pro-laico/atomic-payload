'use client'
import { Icon } from '@/ts/types'
import { Pill, RowLabel, useRowLabel } from '@payloadcms/ui'
import { toTitleCase } from '@/utilities/format/toTitleCase'

interface IconData {
  name: string
  icon: string | Icon
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
