import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './seedButton'
import './index.scss'

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
          <a href="/" target="_blank">
            Link
          </a>
        </li>
        <li>
          {'Return To ReadMe Setup Steps: '}
          <a href="https://github.com/pro-laico/atomic-payload" target="_blank">
            Link
          </a>
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
