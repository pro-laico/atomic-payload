import { Settings } from './settings'
import { baseStorage } from './storage'
import { Tracking } from './tracking/global'
import { SiteMetaData } from './siteMetaData'

const globals = [Settings, Tracking, SiteMetaData, baseStorage('draft'), baseStorage('published')]

export default globals
