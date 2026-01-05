'use client'
import { useRowLabel, Pill, SectionTitle } from '@payloadcms/ui'

interface DesignTokenData {
  name: string
  value: string | string[]
}

const DesignTokenRowLabel = () => {
  const { data, path } = useRowLabel<DesignTokenData>()
  const { name, value } = data || {}

  return (
    <>
      <Pill pillStyle="white" size="small">
        {name || 'Add Name'}
      </Pill>
      {typeof value === 'string' && <SectionTitle path={`${path}.value`} readOnly={false} />}
      {Array.isArray(value) && (
        <Pill pillStyle="white" size="small">
          Values: {value?.length}
        </Pill>
      )}
    </>
  )
}

DesignTokenRowLabel.displayName = 'DesignTokenRowLabel'

export default DesignTokenRowLabel
