import type React from 'react'
import { Banner } from '@payloadcms/ui/elements/Banner'

import './index.scss'
import { SeedControls } from './SeedControls'

const baseClass = 'images-before-dashboard'

/**
 * Rendered at the top of the admin dashboard (`/admin`) via
 * `admin.components.beforeDashboard`. Gives a freshly-registered user a one-click
 * path to upload the sample images and a link back to the rendered site.
 */
const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to the Atomic Payload images demo</h4>
      </Banner>
      <p className={`${baseClass}__lead`}>
        Seed three sample images into the <code>Images</code> collection, each with a focal point on its off-center subject, then view them on the
        site — every size is generated on demand and cropped to the focal point.
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
