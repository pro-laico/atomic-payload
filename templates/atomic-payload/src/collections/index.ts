import { Users } from './users'
import { Images, Favicons } from '@pro-laico/ap-images'
import { MuxVideo } from '@pro-laico/ap-mux-video'

// Pages, Header, Footer are registered by `sitePlugin` (see `@/plugins`).
// PostHogProperty is registered by `trackingPlugin` (see `@/plugins`).
const collections = [Users, Images, Favicons, MuxVideo]

export default collections
