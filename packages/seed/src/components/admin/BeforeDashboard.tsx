import type React from 'react'
import { Banner } from '@payloadcms/ui/elements/Banner'

import './index.scss'
import { SeedButton } from './SeedButton'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to your dashboard!</h4>
      </Banner>
      Steps For Set Up:
      <ul className={`${baseClass}__instructions`}>
        <li>
          {'If you want to add some initial data click: '}
          <SeedButton />
          {'. (Note this will delete existing collection data)'}
        </li>
        <li>
          {'Check out the home page: '}
          <a href="/" target="_blank" rel="noreferrer">
            Link
          </a>
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
