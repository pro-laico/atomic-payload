'use client'

import type { UploadFieldClientProps } from 'payload'
import { UploadField } from '@payloadcms/ui'

import './fontOriginalUpload.scss'

/**
 * The `fontOriginal` upload slots — Payload's own upload field, but with the
 * "Choose from existing" control hidden (see the sibling stylesheet), so every
 * slot always uploads a FRESH original via "Create New".
 *
 * That enforces one `fontOriginal` per typeface slot — an original is never shared
 * between typefaces — which keeps asset cleanup trivially safe and race-free: a
 * de-referenced or deleted original can always be removed, with no reference count
 * and no concurrent-delete hazard (each typeface owns its own files).
 */
export const FontOriginalUpload = (props: UploadFieldClientProps) => (
  <div className="font-original-upload">
    <UploadField {...props} />
  </div>
)

export default FontOriginalUpload
