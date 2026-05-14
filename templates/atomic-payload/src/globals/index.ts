import { Settings } from './settings'
import { baseStorage } from './storage'
import { SiteMetaData } from './siteMetaData'

// Tracking global is registered by `trackingPlugin` (see `@/plugins`).
const globals = [Settings, SiteMetaData, baseStorage('draft'), baseStorage('published')]

export default globals
