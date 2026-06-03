'use client'

import { RowLabel, SectionTitle, useRowLabel } from '@payloadcms/ui'

// Import from the narrow subpath, NOT the `@pro-laico/icons` barrel: the barrel
// pulls in the Icon collection + the `server-only` formatSVG hook, which can't be
// in this `'use client'` component's graph. AtomicIcon is a pure presentational SVG.
import { AtomicIcon } from '@pro-laico/icons/AtomicIcon'
import type { AtomicChild } from '@pro-laico/atomic/children/schema'

import './AtomicRowLabel.scss'

const AtomicRowLabel = () => {
  const { data, path, rowNumber } = useRowLabel<AtomicChild>()
  const { type, tagType, inputType, inputName, buttonType, backendForm, portalType, formName, linkType, portalName, externalLink, email, phone } =
    data || {}

  let typePill = type
  let namePill: string | null | undefined
  let elaborationPill: string | null | undefined
  const typePillStyle = 'atomic-row-pill pill-default'
  const namePillStyle = 'atomic-row-pill pill-name nocap'
  let elaborationPillStyle = 'atomic-row-pill pill-default'
  switch (type) {
    case 'tag': {
      typePill = type
      elaborationPill = tagType
      elaborationPillStyle = 'atomic-row-pill pill-tag'
      break
    }
    case 'form': {
      elaborationPill = backendForm
      elaborationPillStyle = 'atomic-row-pill pill-form'
      namePill = formName
      break
    }
    case 'input': {
      elaborationPill = inputType
      elaborationPillStyle = 'atomic-row-pill pill-input'
      namePill = inputName
      break
    }
    case 'button': {
      elaborationPillStyle = 'atomic-row-pill pill-button'
      switch (buttonType) {
        case 'regular': {
          elaborationPill = 'Regular'
          break
        }
        case 'link': {
          elaborationPill = linkType
          switch (linkType) {
            case 'email': {
              namePill = email
              break
            }
            case 'externalLink': {
              namePill = externalLink
              break
            }
            case 'phone': {
              namePill = phone
              break
            }
          }
          break
        }
        case 'portal': {
          elaborationPill = portalType
          namePill = portalName
          break
        }
      }
      break
    }
  }

  const formattedRowNumber = String(rowNumber ?? 0).padStart(2, '0')

  return (
    <RowLabel
      path={path}
      rowNumber={rowNumber}
      label={
        <div style={{ display: 'flex', gap: '6px' }}>
          <span>{formattedRowNumber}</span>
          <AtomicIcon type={type || 'fragment'} />
          <div style={{ display: 'flex', gap: '6px' }}>
            {typePill && <div className={typePillStyle}>{typePill}</div>}
            {elaborationPill && <div className={elaborationPillStyle}>{elaborationPill}</div>}
            {namePill && <div className={namePillStyle}>{namePill}</div>}
          </div>
          <SectionTitle path={`${path}.blockName`} readOnly={false} />
        </div>
      }
    />
  )
}

AtomicRowLabel.displayName = 'AtomicRowLabel'
export default AtomicRowLabel
