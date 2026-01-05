import React from 'react'
import NextLink from 'next/link'
import { FieldLabel } from '@payloadcms/ui'
import type { APFFieldComponentType } from '@/ts/types'

const APFieldLabelServer: APFFieldComponentType = (props) => {
  const { path, field, docLink } = props
  return (
    <div className="doc-link-label">
      {docLink && (
        <NextLink className="doc-link-button" href={docLink} target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" className="doc-link-button-icon" viewBox="8.0 8.0 112.1 112.1" fill="#2ecc71" stroke="#2ecc71">
            <path d="M64 8a56 56 0 10.1 112.1A56 56 0 0064 8m0 104a48 48 0 110-96 48 48 0 010 96" />
            <path d="M68 36c0 5.3-8 5.3-8 0s8-5.3 8 0m-4 12a4 4 0 00-4 4v40c0 2.2 1.8 4 4 4s4-1.8 4-4V52a4 4 0 00-4-4" />
          </svg>
        </NextLink>
      )}
      <FieldLabel htmlFor={`field-${path}`} label={field?.label} path={path} required={field?.required} />
    </div>
  )
}

export default APFieldLabelServer
