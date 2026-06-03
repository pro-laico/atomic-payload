import { Banner } from '@payloadcms/ui/elements/Banner'
import type React from 'react'

import { SeedControls } from './SeedControls'
import './index.scss'

const baseClass = 'fonts-before-dashboard'

/**
 * Rendered at the top of the admin dashboard (`/admin`) via
 * `admin.components.beforeDashboard`. Gives a freshly-registered user a one-click
 * path to upload the sample fonts and a link back to the rendered site.
 */
const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to the Atomic Payload fonts demo</h4>
      </Banner>
      <p className={`${baseClass}__lead`}>
        Seed four sample fonts into the <code>Font</code> collection (one per family), then view the specimens on the site. The fonts are read
        server-side and inlined into the page — they are never served from a public URL.
      </p>
      <SeedControls />
      <p className={`${baseClass}__footer`}>
        <a href="/" target="_blank" rel="noreferrer">
          ← Back to the site
        </a>
      </p>
    </div>
  )
}

export default BeforeDashboard
