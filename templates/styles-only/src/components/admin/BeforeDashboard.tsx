import { Banner } from '@payloadcms/ui/elements/Banner'
import type React from 'react'
import { SeedControls } from './SeedControls'
import './index.scss'

const baseClass = 'styles-before-dashboard'

/**
 * Rendered at the top of the admin dashboard (`/admin`) via
 * `admin.components.beforeDashboard`. Gives a freshly-registered user a one-click
 * path to populate the demo and a link back to the rendered site.
 */
const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to the Atomic Payload styles demo</h4>
      </Banner>
      <p className={`${baseClass}__lead`}>
        Seed the sample <code>designSet</code>, <code>shortcutSet</code>, and home <code>page</code> (made of example blocks), then view the result.
        Editing any of them in the admin regenerates the stylesheet.
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
